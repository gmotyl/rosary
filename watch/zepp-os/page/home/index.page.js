import {createWidget, widget, prop, align, event} from '@zos/ui'
import {getDeviceInfo} from '@zos/device'
import {px} from '@zos/utils'
import {getText} from '@zos/i18n'
import {LocalStorage} from '@zos/storage'
import {
  Vibrator,
  VIBRATOR_SCENE_SHORT_MIDDLE,
  VIBRATOR_SCENE_STRONG_REMINDER,
} from '@zos/sensor'
import {
  onKey,
  offKey,
  onGesture,
  offGesture,
  KEY_SELECT,
  KEY_UP,
  KEY_DOWN,
  KEY_EVENT_CLICK,
  GESTURE_UP,
  GESTURE_DOWN,
  GESTURE_LEFT,
} from '@zos/interaction'
import {
  setPageBrightTime,
  resetPageBrightTime,
  setWakeUpRelaunch,
  pauseDropWristScreenOff,
  resetDropWristScreenOff,
} from '@zos/display'
import {
  DECADES,
  HAIL_MARYS,
  advance,
  back,
  beadAngle,
  ease,
  nextDecade,
  pulseAt,
  restore,
  rotationForActive,
  slotForBead,
  stepBack,
  stepForward,
} from './rosary'

// Colours from the web app's dark theme (src/app/theme.ts).
const CLARET = 0xd98ba6
const GILT = 0xe7cf9b
const INK = 0xf3ecdd
const INK_MUTED = 0xb8aea0
const BLACK = 0x000000

const STORAGE_KEY = 'progress'
const TURN_MS = 400 // ring turn, as on the web
const FRAME_MS = 25
const FISH_MS = 2600
const FISH_W = 200
const FISH_H = 120
const BRIGHT_MS = 5 * 60 * 1000

const {width: W, height: H} = getDeviceInfo()
const CX = W / 2
const CY = H / 2
const RING_R = px(196)
const OF_R = px(22)
const HM_R = px(15)
const RIM = px(3) // outline width of a bead still to pray
const HALO_PAD = px(6)

const storage = new LocalStorage()
const vibrator = new Vibrator()

let state = {bead: 0, decades: 0}
let rotation = 0
let beads = [] // {halo, outer, inner, r}
let texts = {}
let fish = null
let turnTimer = null
let pulseTimer = null
let fishTimers = []
let celebrating = false

const radiusOf = (i) => (i === 0 ? OF_R : HM_R)

function save() {
  storage.setItem(STORAGE_KEY, {bead: state.bead, decades: state.decades})
}

function buzz(mode) {
  try {
    // start({mode}) gave the wrong pattern on the T-Rex 3 Pro (four pulses for a short
    // scene); the documented setMode() + start() pair is used instead.
    vibrator.stop()
    vibrator.setMode(mode)
    vibrator.start()
  } catch (e) {
    // Vibration is a nicety; never let it break the prayer flow.
  }
}

// prop.MORE works like createWidget's option: pass the full set every time
// (a partial set left the circles without radius/colour on the device), as integers.
function drawCircle(w, x, y, radius, color, alpha) {
  w.setProperty(prop.MORE, {
    center_x: Math.round(x),
    center_y: Math.round(y),
    radius: Math.max(0, Math.round(radius)),
    color,
    alpha: Math.round(alpha),
  })
}

function drawBead(b) {
  drawCircle(b.halo, b.x, b.y, b.haloR, CLARET, b.haloAlpha)
  drawCircle(b.outer, b.x, b.y, b.outerR, CLARET, b.outerAlpha)
  drawCircle(b.inner, b.x, b.y, b.r - RIM, BLACK, b.innerAlpha)
}

// A decade takes a few minutes: keep the screen lit, renewed on every input.
function keepAwake() {
  setPageBrightTime({brightTime: BRIGHT_MS})
}

// Position every bead for the current ring rotation.
function layout() {
  beads.forEach((b, i) => {
    const a = (beadAngle(i, rotation) * Math.PI) / 180
    b.x = CX + RING_R * Math.cos(a)
    b.y = CY + RING_R * Math.sin(a)
    drawBead(b)
  })
}

// Filled = prayed or current; outlined = still to pray. Dimmed while the fish swims.
function paint() {
  const finished = state.decades >= DECADES
  beads.forEach((b, i) => {
    const filled = celebrating || finished || i <= state.bead
    b.outerR = b.r
    b.outerAlpha = celebrating || finished ? 40 : 255
    b.innerAlpha = filled ? 0 : 255
    b.haloR = b.r + HALO_PAD
    b.haloAlpha = 0
    drawBead(b)
  })
  texts.label.setProperty(prop.VISIBLE, !celebrating && !finished)
  texts.count.setProperty(prop.VISIBLE, !celebrating && !finished)
  texts.prayer.setProperty(prop.VISIBLE, !celebrating && !finished)
  texts.count.setProperty(prop.TEXT, `${state.decades} / ${DECADES}`)
  texts.prayer.setProperty(
    prop.TEXT,
    state.bead === 0
      ? getText('ourFather')
      : `${getText('hailMary')} ${state.bead}/${HAIL_MARYS}`,
  )
}

// Same 1.4 s pulse as the web: current bead grows to 1.18×, halo breathes.
function pulse() {
  if (celebrating || state.decades >= DECADES) return
  const b = beads[state.bead]
  const s = pulseAt(Date.now())
  b.outerR = b.r * (1 + 0.18 * s)
  b.haloR = (b.r + HALO_PAD) * (1 + 0.35 * s)
  b.haloAlpha = 80 * (1 - 0.5 * s)
  drawBead(b)
}

function turn(delta) {
  if (turnTimer) {
    clearInterval(turnTimer)
    turnTimer = null
  }
  const from = rotation
  const to = rotation + delta
  const start = Date.now()
  turnTimer = setInterval(() => {
    const t = Math.min(1, (Date.now() - start) / TURN_MS)
    rotation = from + (to - from) * ease(t)
    layout()
    if (t >= 1) {
      clearInterval(turnTimer)
      turnTimer = null
      rotation = to
    }
  }, FRAME_MS)
}

function showCheer(final) {
  const left = DECADES - state.decades
  texts.cheer.setProperty(
    prop.TEXT,
    final ? getText('rosaryDone') : getText('decadeDone'),
  )
  texts.cheerSub.setProperty(
    prop.TEXT,
    final
      ? getText('gloryToLord')
      : left === 1
      ? getText('lastOne')
      : `${getText('left')} ${left}`,
  )
  texts.cheer.setProperty(prop.VISIBLE, true)
  texts.cheerSub.setProperty(prop.VISIBLE, true)
}

function hideCheer() {
  texts.cheer.setProperty(prop.VISIBLE, false)
  texts.cheerSub.setProperty(prop.VISIBLE, false)
  fish.setProperty(prop.VISIBLE, false)
}

function clearFishTimers() {
  fishTimers.forEach((t) => clearTimeout(t))
  fishTimers = []
}

// Fish swims across left → right, the cheer shows in the middle of the swim.
function playFish(final) {
  clearFishTimers()
  const y = CY - FISH_H / 2 - px(15)
  fish.setProperty(prop.MORE, {x: -FISH_W, y: Math.round(y), w: FISH_W, h: FISH_H, src: 'fish.png'})
  fish.setProperty(prop.VISIBLE, true)
  fish.setProperty(prop.ANIM, {
    anim_steps: [
      {
        anim_prop: prop.X,
        anim_from: -FISH_W,
        anim_to: final ? CX - FISH_W / 2 : W,
        anim_rate: 'easeinout',
        anim_duration: final ? FISH_MS / 2 : FISH_MS,
      },
    ],
    anim_fps: 30,
  })
  fishTimers.push(setTimeout(() => showCheer(final), FISH_MS * 0.3))
  if (final) return // fish and message stay until the next tap
  fishTimers.push(
    setTimeout(() => {
      hideCheer()
      celebrating = false
      state = nextDecade(state)
      turn(stepForward(HAIL_MARYS))
      paint()
    }, FISH_MS + 100),
  )
}

function onAdvance() {
  keepAwake()
  if (celebrating) return
  const prev = state
  const next = advance(state)
  if (next.event === 'restart') {
    clearFishTimers()
    hideCheer()
    state = {bead: 0, decades: 0}
    rotation = rotationForActive(slotForBead(0))
    layout()
    paint()
    save()
    return
  }
  if (next.event === 'step') {
    state = {bead: next.bead, decades: next.decades}
    buzz(VIBRATOR_SCENE_SHORT_MIDDLE) // one short pulse per bead
    turn(stepForward(prev.bead))
    paint()
    save()
    return
  }
  // Decade or whole rosary finished.
  const final = next.event === 'rosary'
  state = {bead: next.bead, decades: next.decades}
  // Persist the start of the next decade now, so leaving mid-fish loses nothing.
  storage.setItem(STORAGE_KEY, final ? state : nextDecade(state))
  buzz(VIBRATOR_SCENE_STRONG_REMINDER) // four pulses: decade done
  celebrating = !final
  paint() // dims the ring for the swim (and keeps it dimmed after the last decade)
  playFish(final)
}

function onBack() {
  keepAwake()
  if (celebrating) return
  const prev = state
  const next = back(state)
  if (next.bead === prev.bead) return
  state = next
  turn(stepBack(prev.bead))
  paint()
  save()
}

Page({
  onInit() {
    state = restore(storage.getItem(STORAGE_KEY))
    // A rosary that was completed earlier starts fresh on the next open.
    if (state.decades >= DECADES) state = {bead: 0, decades: 0}
    rotation = rotationForActive(slotForBead(state.bead))
  },

  build() {
    // Thread the beads sit on.
    createWidget(widget.CIRCLE, {center_x: CX, center_y: CY, radius: RING_R + 1, color: 0x2a2226})
    createWidget(widget.CIRCLE, {center_x: CX, center_y: CY, radius: RING_R - 1, color: BLACK})

    beads = []
    for (let i = 0; i <= HAIL_MARYS; i++) {
      const r = radiusOf(i)
      const base = {center_x: CX, center_y: CY}
      beads.push({
        r,
        x: CX,
        y: CY,
        outerR: r,
        outerAlpha: 255,
        innerAlpha: 255,
        haloR: r + HALO_PAD,
        haloAlpha: 0,
        halo: createWidget(widget.CIRCLE, {...base, radius: r + HALO_PAD, color: CLARET, alpha: 0}),
        outer: createWidget(widget.CIRCLE, {...base, radius: r, color: CLARET}),
        inner: createWidget(widget.CIRCLE, {...base, radius: r - RIM, color: BLACK}),
      })
    }

    const textBox = (y, h, size, color) => ({
      x: px(60),
      y,
      w: W - px(120),
      h,
      color,
      text_size: size,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: '',
    })
    texts.label = createWidget(widget.TEXT, {
      ...textBox(CY - px(90), px(36), px(22), INK_MUTED),
      text: getText('decade'),
    })
    texts.count = createWidget(widget.TEXT, textBox(CY - px(55), px(96), px(80), INK))
    texts.prayer = createWidget(widget.TEXT, textBox(CY + px(48), px(40), px(26), GILT))

    fish = createWidget(widget.IMG, {x: -FISH_W, y: 0, w: FISH_W, h: FISH_H, src: 'fish.png'})
    fish.setProperty(prop.VISIBLE, false)
    texts.cheer = createWidget(widget.TEXT, textBox(CY + px(60), px(44), px(32), INK))
    texts.cheerSub = createWidget(widget.TEXT, textBox(CY + px(104), px(36), px(24), INK_MUTED))
    texts.cheer.setProperty(prop.VISIBLE, false)
    texts.cheerSub.setProperty(prop.VISIBLE, false)

    // Transparent layer on top: a tap anywhere advances.
    const touch = createWidget(widget.FILL_RECT, {x: 0, y: 0, w: W, h: H, color: BLACK, alpha: 0})
    touch.addEventListener(event.CLICK_UP, onAdvance)

    // Physical buttons: select / down advance, up goes back one bead.
    onKey({
      callback: (key, keyEvent) => {
        if (keyEvent !== KEY_EVENT_CLICK) return false
        if (key === KEY_SELECT || key === KEY_DOWN) {
          onAdvance()
          return true
        }
        if (key === KEY_UP) {
          onBack()
          return true
        }
        return false
      },
    })

    // Swipes advance like on the web; swipe right is left to the system (exit).
    onGesture({
      callback: (g) => {
        if (g === GESTURE_UP || g === GESTURE_DOWN || g === GESTURE_LEFT) {
          onAdvance()
          return true
        }
        return false
      },
    })

    layout()
    paint()
    pulseTimer = setInterval(pulse, 40)
    keepAwake()
    // If the screen still goes off, waking the watch returns here instead of the watch face.
    setWakeUpRelaunch({relaunch: true})
    // Lowering the wrist while praying must not switch the screen off.
    pauseDropWristScreenOff({duration: 0})
  },

  onDestroy() {
    if (pulseTimer) clearInterval(pulseTimer)
    if (turnTimer) clearInterval(turnTimer)
    clearFishTimers()
    offKey()
    offGesture()
    resetPageBrightTime()
    resetDropWristScreenOff()
    setWakeUpRelaunch({relaunch: false})
    save()
  },
})
