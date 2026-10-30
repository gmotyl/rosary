import {describe, it, expect} from 'vitest'
import {
  ChangeDay,
  advanceMystery,
  changeDateInMonth,
  changeDatesBetween,
  latestChangeDateOnOrBefore,
  toLocalDate,
} from '../roseChangeDay'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const secondSaturday: ChangeDay = {kind: 'nthWeekday', nth: 2, weekday: 'sat'}

describe('changeDateInMonth', () => {
  it('nth weekday: first..fourth and last', () => {
    // November 2026: Mondays fall on 2, 9, 16, 23, 30
    const monday = (nth: 1 | 2 | 3 | 4 | 'last'): ChangeDay => ({
      kind: 'nthWeekday',
      nth,
      weekday: 'mon',
    })
    expect(changeDateInMonth(monday(1), 2026, 10)).toBe('2026-11-02')
    expect(changeDateInMonth(monday(2), 2026, 10)).toBe('2026-11-09')
    expect(changeDateInMonth(monday(3), 2026, 10)).toBe('2026-11-16')
    expect(changeDateInMonth(monday(4), 2026, 10)).toBe('2026-11-23')
    expect(changeDateInMonth(monday('last'), 2026, 10)).toBe('2026-11-30')

    expect(changeDateInMonth(secondSaturday, 2026, 10)).toBe('2026-11-14')
    expect(
      changeDateInMonth(
        {kind: 'nthWeekday', nth: 'last', weekday: 'sun'},
        2026,
        9,
      ),
    ).toBe('2026-10-25')
  })

  it('last weekday in 4- and 5-occurrence months', () => {
    const fourth: ChangeDay = {kind: 'nthWeekday', nth: 4, weekday: 'sat'}
    const last: ChangeDay = {kind: 'nthWeekday', nth: 'last', weekday: 'sat'}
    // October 2026 has five Saturdays (3, 10, 17, 24, 31)
    expect(changeDateInMonth(fourth, 2026, 9)).toBe('2026-10-24')
    expect(changeDateInMonth(last, 2026, 9)).toBe('2026-10-31')
    // November 2026 has four Saturdays (7, 14, 21, 28)
    expect(changeDateInMonth(fourth, 2026, 10)).toBe('2026-11-28')
    expect(changeDateInMonth(last, 2026, 10)).toBe('2026-11-28')
  })

  it('day 31 clamps in 30/28/29-day months', () => {
    const day31: ChangeDay = {kind: 'dayOfMonth', day: 31}
    expect(changeDateInMonth(day31, 2027, 1)).toBe('2027-02-28')
    expect(changeDateInMonth(day31, 2028, 1)).toBe('2028-02-29')
    expect(changeDateInMonth(day31, 2026, 3)).toBe('2026-04-30')
    expect(changeDateInMonth(day31, 2026, 4)).toBe('2026-05-31')
  })
})

describe('changeDatesBetween', () => {
  it('dates between spans months in order', () => {
    expect(
      changeDatesBetween(secondSaturday, '2026-10-30', '2027-01-09'),
    ).toEqual(['2026-11-14', '2026-12-12', '2027-01-09'])
    // the lower bound is exclusive, the upper bound inclusive
    expect(
      changeDatesBetween(secondSaturday, '2026-11-14', '2026-12-12'),
    ).toEqual(['2026-12-12'])
    expect(
      changeDatesBetween(secondSaturday, '2026-11-14', '2026-12-11'),
    ).toEqual([])
  })

  it('dates between is empty when clock moved backwards', () => {
    expect(
      changeDatesBetween(secondSaturday, '2027-01-09', '2026-10-01'),
    ).toEqual([])
  })
})

describe('latestChangeDateOnOrBefore', () => {
  it('latest change date on or before', () => {
    expect(latestChangeDateOnOrBefore(secondSaturday, '2026-11-14')).toBe(
      '2026-11-14',
    )
    expect(latestChangeDateOnOrBefore(secondSaturday, '2026-11-30')).toBe(
      '2026-11-14',
    )
    expect(latestChangeDateOnOrBefore(secondSaturday, '2026-11-13')).toBe(
      '2026-10-10',
    )
    // crosses a year boundary
    expect(latestChangeDateOnOrBefore(secondSaturday, '2027-01-05')).toBe(
      '2026-12-12',
    )
  })
})

describe('advanceMystery', () => {
  it('advanceMystery wraps Glorious 5 to Joyful 1', () => {
    expect(advanceMystery(MysteryTypes.Glorious5, 1)).toBe(MysteryTypes.Joyful1)
    expect(advanceMystery(MysteryTypes.Joyful3, 22)).toBe(MysteryTypes.Joyful5)
    expect(advanceMystery(MysteryTypes.Joyful5, 1)).toBe(MysteryTypes.Luminous1)
    expect(advanceMystery(MysteryTypes.Sorrowful2, 0)).toBe(
      MysteryTypes.Sorrowful2,
    )
  })
})

describe('toLocalDate', () => {
  it('toLocalDate uses local calendar date', () => {
    // late evening: west of UTC the UTC date is already the next day
    expect(toLocalDate(new Date(2026, 9, 30, 23, 30))).toBe('2026-10-30')
    // just after midnight: east of UTC the UTC date is still the previous day
    expect(toLocalDate(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01')
  })
})
