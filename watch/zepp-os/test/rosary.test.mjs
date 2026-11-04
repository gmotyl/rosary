import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DECADES,
  SLOT_COUNT,
  SLOT_ANGLE,
  advance,
  back,
  beadAngle,
  ease,
  nextDecade,
  restore,
  rotationForActive,
  slotForBead,
  stepBack,
  stepForward,
} from '../page/home/rosary.js'

const norm = (deg) => ((deg % 360) + 360) % 360

test('the current bead always lands at the bottom', () => {
  let rotation = rotationForActive(0)
  assert.equal(norm(beadAngle(0, rotation)), 90)
  for (let bead = 0; bead < 10; bead++) {
    rotation += stepForward(bead)
    assert.equal(Math.round(norm(beadAngle(bead + 1, rotation))), 90)
  }
  // HM10 → next Our Father through the gap
  rotation += stepForward(10)
  assert.equal(Math.round(norm(beadAngle(0, rotation))), 90)
})

test('back undoes a forward step', () => {
  for (let bead = 0; bead < 10; bead++) {
    assert.equal(stepForward(bead) + stepBack(bead + 1), 0)
  }
})

test('the Our Father gap is wider than the Hail Mary spacing', () => {
  assert.equal(slotForBead(1) - slotForBead(0), 3)
  assert.equal(slotForBead(2) - slotForBead(1), 1)
  assert.equal(SLOT_COUNT - slotForBead(10), 3)
  assert.equal(SLOT_ANGLE * SLOT_COUNT, 360)
})

test('advance walks a decade, then reports it', () => {
  let s = {bead: 0, decades: 0}
  for (let i = 0; i < 10; i++) {
    const r = advance(s)
    assert.equal(r.event, 'step')
    s = r
  }
  const done = advance(s)
  assert.deepEqual(done, {bead: 10, decades: 1, event: 'decade'})
  assert.deepEqual(nextDecade(done), {bead: 0, decades: 1})
})

test('the fifth decade ends the rosary and the next tap restarts', () => {
  const end = advance({bead: 10, decades: DECADES - 1})
  assert.equal(end.event, 'rosary')
  assert.equal(end.decades, DECADES)
  assert.deepEqual(advance(end), {bead: 0, decades: 0, event: 'restart'})
})

test('back stops at the Our Father and after the rosary', () => {
  assert.deepEqual(back({bead: 0, decades: 2}), {bead: 0, decades: 2})
  assert.deepEqual(back({bead: 4, decades: 2}), {bead: 3, decades: 2})
  assert.deepEqual(back({bead: 3, decades: DECADES}), {bead: 3, decades: DECADES})
})

test('restore rejects garbage', () => {
  assert.deepEqual(restore(undefined), {bead: 0, decades: 0})
  assert.deepEqual(restore({bead: 11, decades: 1}), {bead: 0, decades: 0})
  assert.deepEqual(restore({bead: '3', decades: '2'}), {bead: 3, decades: 2})
})

test('ease matches cubic-bezier(0.4, 0, 0.2, 1) end points and shape', () => {
  assert.equal(ease(0), 0)
  assert.equal(ease(1), 1)
  assert.ok(ease(0.5) > 0.7 && ease(0.5) < 0.85)
})
