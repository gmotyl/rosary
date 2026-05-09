import {describe, it, expect} from 'vitest'
import {
  MysteryGroup,
  groupOf,
  firstMysteryOfGroup,
  decadeIndex,
  ALL_DECADES_MASK,
  bitForMystery,
} from '../rosaryGroups'
import {MysteryTypes} from 'src/consts/MysteryTypes'

describe('groupOf', () => {
  it('maps Joyful 1..5 to Joyful', () => {
    expect(groupOf(MysteryTypes.Joyful1)).toBe(MysteryGroup.Joyful)
    expect(groupOf(MysteryTypes.Joyful5)).toBe(MysteryGroup.Joyful)
  })
  it('maps Luminous 1..5 to Luminous', () => {
    expect(groupOf(MysteryTypes.Luminous1)).toBe(MysteryGroup.Luminous)
    expect(groupOf(MysteryTypes.Luminous5)).toBe(MysteryGroup.Luminous)
  })
  it('maps Sorrowful 1..5 to Sorrowful', () => {
    expect(groupOf(MysteryTypes.Sorrowful1)).toBe(MysteryGroup.Sorrowful)
    expect(groupOf(MysteryTypes.Sorrowful5)).toBe(MysteryGroup.Sorrowful)
  })
  it('maps Glorious 1..5 to Glorious', () => {
    expect(groupOf(MysteryTypes.Glorious1)).toBe(MysteryGroup.Glorious)
    expect(groupOf(MysteryTypes.Glorious5)).toBe(MysteryGroup.Glorious)
  })
})

describe('firstMysteryOfGroup', () => {
  it('returns Joyful1 for Joyful', () => {
    expect(firstMysteryOfGroup(MysteryGroup.Joyful)).toBe(MysteryTypes.Joyful1)
  })
  it('returns Luminous1 for Luminous', () => {
    expect(firstMysteryOfGroup(MysteryGroup.Luminous)).toBe(MysteryTypes.Luminous1)
  })
  it('returns Sorrowful1 for Sorrowful', () => {
    expect(firstMysteryOfGroup(MysteryGroup.Sorrowful)).toBe(MysteryTypes.Sorrowful1)
  })
  it('returns Glorious1 for Glorious', () => {
    expect(firstMysteryOfGroup(MysteryGroup.Glorious)).toBe(MysteryTypes.Glorious1)
  })
})

describe('decadeIndex', () => {
  it('returns 1..5 within each group', () => {
    expect(decadeIndex(MysteryTypes.Joyful1)).toBe(1)
    expect(decadeIndex(MysteryTypes.Joyful5)).toBe(5)
    expect(decadeIndex(MysteryTypes.Sorrowful3)).toBe(3)
    expect(decadeIndex(MysteryTypes.Glorious5)).toBe(5)
  })
})

describe('bitForMystery', () => {
  it('maps mystery 1 to bit 0, mystery 20 to bit 19', () => {
    expect(bitForMystery(MysteryTypes.Joyful1)).toBe(1 << 0)
    expect(bitForMystery(MysteryTypes.Glorious5)).toBe(1 << 19)
    expect(bitForMystery(MysteryTypes.Luminous1)).toBe(1 << 5)
  })
})

describe('ALL_DECADES_MASK', () => {
  it('is 0xFFFFF (20 bits set)', () => {
    expect(ALL_DECADES_MASK).toBe(0xfffff)
  })
})
