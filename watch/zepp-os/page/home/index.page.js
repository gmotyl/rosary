import {createWidget, widget, prop, align, event} from '@zos/ui'
import {getDeviceInfo} from '@zos/device'
import {px} from '@zos/utils'
import {getText} from '@zos/i18n'
import {LocalStorage} from '@zos/storage'
import {
  Vibrator,
  VIBRATOR_SCENE_SHORT_LIGHT,
  VIBRATOR_SCENE_NOTIFICATION,
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
  beadAngle,
  ease,
  nextDecade,
  pulseAt,
  restore,
  rotationForActive,
  slotForBead,
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
const CROSS_W = 100
const CROSS_H = 140
const CROSS_FADE_MS = 700
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
let cross = null
let prayersTimer = null
let turnTimer = null
let pulseTimer = null
let fishTimers = []
// After the tenth Hail Mary: 'prayers' (cross, Glory Be + O my Jesus, waits for a tap),
// then 'fish' (the swim), then back to null; after the fifth decade the fish ends in 'done'.
let phase = null

const radiusOf = (i) => (i === 0 ? OF_R : HM_R)

function save() {
  storage.setItem(STORAGE_KEY, {bead: state.bead, decades: state.decades})
}

// Patterns picked by feel on the T-Rex 3 Pro with the Vibe Lab spike
// (spikes/zepp-trex-spike/vibration). The intuitive choices were wrong there:
// start({mode}) played four pulses for a "short" scene, and the built-in
// multi-pulse scenes felt far too long.
const BEAD_BUZZ_MS = 40

function vibrate(play) {
  try {
    vibrator.stop()
    play()
  } catch (e) {
    // Vibration is a nicety; never let it break the prayer flow.
  }
}

// Plain short tick: setMode() + start() (the pair the docs show).
function buzzMode(mode) {
  vibrate(() => {
    vibrator.setMode(mode)
    vibrator.start()
  })
}

// Hail Mary: a 40 ms continuous scene (API_LEVEL 3.6 scene list); falls back to the light tick.
function buzzBead() {
  let types = null
  try {
    types = vibrator.getType()
  } catch (e) {
    types = null
  }
  if (!types || types.CONTINUOUS === undefined) {
    buzzMode(VIBRATOR_SCENE_SHORT_LIGHT)
    return
  }
  vibrate(() => vibrator.start([{type: types.CONTINUOUS, duration: BEAD_BUZZ_MS}]))
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
    const dim = phase !== null || finished
    const filled = dim || i <= state.bead
    b.outerR = b.r
    b.outerAlpha = dim ? 40 : 255
    b.innerAlpha = filled ? 0 : 255
    b.haloR = b.r + HALO_PAD
    b.haloAlpha = 0
    drawBead(b)
  })
  const centre = phase === null && !finished && !confirmingReset
  texts.label.setProperty(prop.VISIBLE, centre)
  texts.count.setProperty(prop.VISIBLE, centre)
  texts.prayer.setProperty(prop.VISIBLE, centre)
  // The decade being prayed (1..5), not the finished ones: there is no decade 0.
  texts.count.setProperty(prop.TEXT, `${Math.min(state.decades + 1, DECADES)} / ${DECADES}`)
  texts.prayer.setProperty(
    prop.TEXT,
    state.bead === 0
      ? getText('ourFather')
      : `${getText('hailMary')} ${state.bead}/${HAIL_MARYS}`,
  )
}

// Same 1.4 s pulse as the web: current bead grows to 1.18×, halo breathes.
function pulse() {
  if (phase !== null || state.decades >= DECADES) return
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

const CHEER_Y = CY + px(60)
const CHEER_SUB_Y = CY + px(104)
const CHEER_RISE = px(30)
const CHEER_RISE_MS = 500

// "Prayed / Glory to the Lord!" (or "Rosary complete" at the end) rises in under the fish.
function showCheer(final) {
  texts.cheer.setProperty(prop.TEXT, final ? getText('rosaryDone') : getText('decadeDone'))
  texts.cheerSub.setProperty(prop.TEXT, getText('gloryToLord'))
  ;[
    [texts.cheer, CHEER_Y],
    [texts.cheerSub, CHEER_SUB_Y],
  ].forEach(([t, y], i) => {
    t.setProperty(prop.Y, y + CHEER_RISE)
    t.setProperty(prop.VISIBLE, true)
    t.setProperty(prop.ANIM, {
      anim_steps: [
        {
          anim_prop: prop.Y,
          anim_from: y + CHEER_RISE,
          anim_to: y,
          anim_rate: 'easeout',
          anim_duration: CHEER_RISE_MS,
          anim_offset: i * 150,
        },
      ],
      anim_fps: 30,
    })
  })
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

// Glory Be + O my Jesus: the cross fades in with both prayers under it.
function showPrayers() {
  clearFishTimers()
  cross.setProperty(prop.VISIBLE, true)
  cross.setProperty(prop.ANIM, {
    anim_steps: [
      {
        anim_prop: prop.ALPHA,
        anim_from: 0,
        anim_to: 255,
        anim_rate: 'easeout',
        anim_duration: CROSS_FADE_MS,
      },
    ],
    anim_fps: 30,
  })
  prayersTimer = setTimeout(() => {
    prayersTimer = null
    texts.gloryBe.setProperty(prop.VISIBLE, true)
    texts.fatima.setProperty(prop.VISIBLE, true)
  }, CROSS_FADE_MS / 2)
}

function hidePrayers() {
  if (prayersTimer) {
    clearTimeout(prayersTimer)
    prayersTimer = null
  }
  cross.setProperty(prop.VISIBLE, false)
  texts.gloryBe.setProperty(prop.VISIBLE, false)
  texts.fatima.setProperty(prop.VISIBLE, false)
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
  if (final) {
    // Fish and message stay; once the swim is over the next tap starts over.
    fishTimers.push(setTimeout(() => (phase = 'done'), FISH_MS / 2))
    return
  }
  fishTimers.push(
    setTimeout(() => {
      hideCheer()
      phase = null
      state = nextDecade(state)
      turn(stepForward(HAIL_MARYS))
      paint()
    }, FISH_MS + 100),
  )
}

function onAdvance() {
  keepAwake()
  if (confirmingReset) {
    showResetPrompt(false) // any other input cancels the reset
    return
  }
  if (phase === 'fish') return
  if (phase === 'done') {
    resetRosary()
    return
  }
  if (phase === 'prayers') {
    // Prayers said: the fish swims in.
    hidePrayers()
    phase = 'fish'
    buzzMode(VIBRATOR_SCENE_NOTIFICATION)
    playFish(state.decades >= DECADES)
    return
  }
  const prev = state
  const next = advance(state)
  if (next.event === 'restart') {
    resetRosary()
    return
  }
  if (next.event === 'step') {
    state = {bead: next.bead, decades: next.decades}
    buzzBead()
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
  buzzMode(VIBRATOR_SCENE_SHORT_LIGHT) // cross: a lighter tick, distinct from the 40 ms bead buzz
  phase = 'prayers'
  paint() // dims the ring and hides the counter
  showPrayers()
}

// Back to the first Our Father of the first decade.
function resetRosary() {
  if (turnTimer) {
    clearInterval(turnTimer)
    turnTimer = null
  }
  clearFishTimers()
  hideCheer()
  phase = null
  hidePrayers()
  state = {bead: 0, decades: 0}
  rotation = rotationForActive(slotForBead(0))
  layout()
  paint()
  save()
}

// Reset is confirmed in-app: Up shows "Reset?", Up again resets, anything else cancels.
// (The system createModal lost its confirm on the watch: our own key handler takes Select.)
const RESET_CONFIRM_MS = 5000
let confirmingReset = false
let resetTimer = null

function showResetPrompt(on) {
  confirmingReset = on
  if (resetTimer) {
    clearTimeout(resetTimer)
    resetTimer = null
  }
  texts.resetQ.setProperty(prop.VISIBLE, on)
  texts.resetHint.setProperty(prop.VISIBLE, on)
  // The prompt takes the screen centre; the cross and its prayers step aside meanwhile.
  if (phase === 'prayers') {
    cross.setProperty(prop.VISIBLE, !on)
    texts.gloryBe.setProperty(prop.VISIBLE, !on)
    texts.fatima.setProperty(prop.VISIBLE, !on)
  }
  if (on) resetTimer = setTimeout(() => showResetPrompt(false), RESET_CONFIRM_MS)
  paint()
}

function onUp() {
  keepAwake()
  if (confirmingReset) {
    showResetPrompt(false)
    resetRosary()
    buzzMode(VIBRATOR_SCENE_SHORT_LIGHT)
    return
  }
  showResetPrompt(true)
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

    cross = createWidget(widget.IMG, {
      x: Math.round(CX - CROSS_W / 2),
      y: Math.round(CY - CROSS_H - px(10)),
      w: CROSS_W,
      h: CROSS_H,
      src: 'cross.png',
      alpha: 0,
    })
    cross.setProperty(prop.VISIBLE, false)
    texts.gloryBe = createWidget(widget.TEXT, {
      ...textBox(CY + px(14), px(44), px(32), GILT),
      text: getText('gloryBe'),
    })
    texts.fatima = createWidget(widget.TEXT, {
      ...textBox(CY + px(60), px(44), px(32), GILT),
      text: getText('fatimaPrayer'),
    })
    texts.gloryBe.setProperty(prop.VISIBLE, false)
    texts.fatima.setProperty(prop.VISIBLE, false)

    texts.resetQ = createWidget(widget.TEXT, {
      ...textBox(CY - px(50), px(70), px(56), INK),
      text: getText('resetQuestion'),
    })
    texts.resetHint = createWidget(widget.TEXT, {
      ...textBox(CY + px(30), px(40), px(24), INK_MUTED),
      text: getText('resetHint'),
    })
    texts.resetQ.setProperty(prop.VISIBLE, false)
    texts.resetHint.setProperty(prop.VISIBLE, false)

    // Created last so nothing covers them.
    texts.cheer = createWidget(widget.TEXT, textBox(CHEER_Y, px(44), px(34), INK))
    texts.cheerSub = createWidget(widget.TEXT, textBox(CHEER_SUB_Y, px(40), px(28), GILT))
    texts.cheer.setProperty(prop.VISIBLE, false)
    texts.cheerSub.setProperty(prop.VISIBLE, false)

    // Transparent layer on top: a tap anywhere advances.
    const touch = createWidget(widget.FILL_RECT, {x: 0, y: 0, w: W, h: H, color: BLACK, alpha: 0})
    touch.addEventListener(event.CLICK_UP, onAdvance)

    // Physical buttons: select / down advance, up asks to reset.
    onKey({
      callback: (key, keyEvent) => {
        if (keyEvent !== KEY_EVENT_CLICK) return false
        if (key === KEY_SELECT || key === KEY_DOWN) {
          onAdvance()
          return true
        }
        if (key === KEY_UP) {
          onUp()
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
    if (prayersTimer) clearTimeout(prayersTimer)
    if (resetTimer) clearTimeout(resetTimer)
    vibrator.stop()
    offKey()
    offGesture()
    resetPageBrightTime()
    resetDropWristScreenOff()
    setWakeUpRelaunch({relaunch: false})
    save()
  },
})
