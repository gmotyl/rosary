// Pure rosary-ring logic shared by the page and the Node tests.
// No @zos imports here, so it runs under `node --test`.

export const DECADES = 5
export const HAIL_MARYS = 10
// Empty slots on each side of the Our Father bead (the web app uses 1).
export const GAP = 2
// Slot 0 = Our Father, slots 1..GAP = gap, then Hail Mary 1..10, then GAP more.
export const SLOT_COUNT = 1 + HAIL_MARYS + 2 * GAP
export const SLOT_ANGLE = 360 / SLOT_COUNT

export const slotForBead = (bead) => (bead === 0 ? 0 : bead + GAP)

// Slot 0 sits at the top (-90°). This rotation puts `slot` at the bottom (+90°).
export const rotationForActive = (slot) => 180 - slot * SLOT_ANGLE

// Screen angle of a bead (degrees, 0 = 3 o'clock, clockwise) for a ring rotation.
export const beadAngle = (bead, rotation) =>
  -90 + slotForBead(bead) * SLOT_ANGLE + rotation

// Rotation delta for moving the current bead forward by one step.
// HM10 → next Our Father turns through the trailing gap.
export const stepForward = (bead) => {
  const from = slotForBead(bead)
  const to = bead === HAIL_MARYS ? SLOT_COUNT : slotForBead(bead + 1)
  return -(to - from) * SLOT_ANGLE
}

export const stepBack = (bead) =>
  (slotForBead(bead) - slotForBead(bead - 1)) * SLOT_ANGLE

/**
 * Advance one bead.
 * @returns {{bead: number, decades: number, event: 'step'|'decade'|'rosary'|'restart'}}
 * On 'decade' and 'rosary' the bead stays on 10 so the page can play the fish;
 * the page then calls nextDecade().
 */
export function advance({bead, decades}) {
  if (decades >= DECADES) return {bead: 0, decades: 0, event: 'restart'}
  if (bead < HAIL_MARYS) return {bead: bead + 1, decades, event: 'step'}
  const done = decades + 1
  return {bead, decades: done, event: done >= DECADES ? 'rosary' : 'decade'}
}

export const nextDecade = ({decades}) => ({bead: 0, decades})

export function back({bead, decades}) {
  if (decades >= DECADES || bead === 0) return {bead, decades}
  return {bead: bead - 1, decades}
}

// Sanitises whatever came back from storage.
export function restore(saved) {
  const bead = Number(saved && saved.bead)
  const decades = Number(saved && saved.decades)
  const ok =
    Number.isInteger(bead) &&
    Number.isInteger(decades) &&
    bead >= 0 &&
    bead <= HAIL_MARYS &&
    decades >= 0 &&
    decades <= DECADES
  return ok ? {bead, decades} : {bead: 0, decades: 0}
}

// cubic-bezier(0.4, 0, 0.2, 1), the web ring's easing, solved for x by Newton steps.
export function ease(t) {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const x1 = 0.4
  const y1 = 0
  const x2 = 0.2
  const y2 = 1
  const bx = (u) => 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u ** 2 * (1 - u) + u ** 3
  const by = (u) => 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u ** 2 * (1 - u) + u ** 3
  const dx = (u) =>
    3 * x1 * (1 - u) ** 2 + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u ** 2
  let u = t
  for (let i = 0; i < 6; i++) {
    const d = dx(u)
    if (Math.abs(d) < 1e-6) break
    u -= (bx(u) - t) / d
    u = Math.min(1, Math.max(0, u))
  }
  return by(u)
}

// Pulse phase 0..1..0 over the 1.4 s web pulse period.
export const PULSE_MS = 1400
export const pulseAt = (ms) => (1 - Math.cos((2 * Math.PI * (ms % PULSE_MS)) / PULSE_MS)) / 2
