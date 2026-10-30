import {vi, describe, it, expect, beforeEach, afterEach} from 'vitest'
import {renderHook, act} from '@testing-library/react-hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ChangeDay} from 'src/utils/roseChangeDay'
import {useRoses, ROSES_KEY} from '../useRoses'

const firstSunday: ChangeDay = {kind: 'nthWeekday', nth: 1, weekday: 'sun'}

// Local-time noon avoids any UTC/day-boundary ambiguity
const setToday = (year: number, month: number, day: number) =>
  vi.setSystemTime(new Date(year, month - 1, day, 12))

describe('useRoses', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({toFake: ['Date']})
    setToday(2026, 10, 30)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a rose with trimmed name and current-period lastChange', () => {
    const {result} = renderHook(() => useRoses())

    act(() => {
      // Two adds in one tick must both survive
      result.current.addRose({
        name: '  Róża A  ',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      })
      result.current.addRose({
        name: 'Róża B',
        mystery: MysteryTypes.Sorrowful2,
        changeDay: {kind: 'dayOfMonth', day: 31},
      })
    })

    const [a, b] = result.current.roses
    expect(result.current.roses).toHaveLength(2)
    expect(a).toMatchObject({
      name: 'Róża A',
      mystery: MysteryTypes.Joyful1,
      lastChange: '2026-10-04',
      prayedDays: [],
      showNewMysteryBanner: false,
      currentBead: 0,
    })
    // Oct 31 is still ahead on Oct 30, so the current period started Sep 30
    expect(b).toMatchObject({name: 'Róża B', lastChange: '2026-09-30'})
    expect(a.id).not.toBe(b.id)
    expect(result.current.getRose(b.id)).toEqual(b)
  })

  it('renames, changes mystery and rule without advancing', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      }).id
    })

    act(() => {
      result.current.updateRose(id, {
        name: ' B ',
        mystery: MysteryTypes.Sorrowful3,
      })
      result.current.updateRose(id, {changeDay: {kind: 'dayOfMonth', day: 15}})
    })

    expect(result.current.getRose(id)).toMatchObject({
      name: 'B',
      mystery: MysteryTypes.Sorrowful3,
      changeDay: {kind: 'dayOfMonth', day: 15},
      lastChange: '2026-10-15',
      showNewMysteryBanner: false,
    })

    act(() => result.current.applyChangeDays(id))

    expect(result.current.getRose(id)?.mystery).toBe(MysteryTypes.Sorrowful3)
    expect(result.current.getRose(id)?.showNewMysteryBanner).toBe(false)
  })

  it('deletes a rose', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      }).id
      result.current.addRose({
        name: 'B',
        mystery: MysteryTypes.Joyful2,
        changeDay: firstSunday,
      })
    })

    act(() => result.current.deleteRose(id))

    expect(result.current.roses.map((r) => r.name)).toEqual(['B'])
    expect(result.current.getRose(id)).toBeUndefined()
  })

  it('applyChangeDays advances by n and turns banner on', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Glorious4,
        changeDay: firstSunday,
      }).id
    })
    act(() => {
      result.current.advanceBead(id)
      result.current.advanceBead(id)
    })
    expect(result.current.getRose(id)?.currentBead).toBe(2)

    // Change dates after 2026-10-04 up to 2027-01-10: Nov 1, Dec 6, Jan 3
    act(() => result.current.applyChangeDays(id, '2027-01-10'))

    expect(result.current.getRose(id)).toMatchObject({
      mystery: MysteryTypes.Joyful2, // Glorious4 + 3 wraps past Glorious5
      lastChange: '2027-01-03',
      showNewMysteryBanner: true,
      currentBead: 0,
    })

    act(() => result.current.dismissBanner(id))
    expect(result.current.getRose(id)?.showNewMysteryBanner).toBe(false)
  })

  it('applyChangeDays is a no-op when clock moved backwards', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful3,
        changeDay: firstSunday,
      }).id
    })
    const before = result.current.getRose(id)

    act(() => result.current.applyChangeDays(id, '2026-09-01'))
    expect(result.current.getRose(id)).toEqual(before)

    act(() => result.current.applyChangeDays(id, '2026-10-30'))
    expect(result.current.getRose(id)).toEqual(before)
  })

  it('toggleDay adds and removes a date', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      }).id
    })

    act(() => {
      result.current.toggleDay(id, '2026-10-20')
      result.current.toggleDay(id, '2026-10-21')
    })
    expect(result.current.getRose(id)?.prayedDays).toEqual([
      '2026-10-20',
      '2026-10-21',
    ])

    act(() => result.current.toggleDay(id, '2026-10-20'))
    expect(result.current.getRose(id)?.prayedDays).toEqual(['2026-10-21'])
  })

  it('completing the decade is idempotent for today', () => {
    const {result} = renderHook(() => useRoses())
    let id = ''
    act(() => {
      id = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      }).id
    })
    // Next day after a change date: banner turns on
    setToday(2026, 11, 2)
    act(() => result.current.applyChangeDays(id))
    expect(result.current.getRose(id)?.showNewMysteryBanner).toBe(true)

    act(() => result.current.retreatBead(id))
    expect(result.current.getRose(id)?.currentBead).toBe(0)

    const prayDecade = () => {
      const results: boolean[] = []
      act(() => {
        // OF (0) → HM1..HM10, then the 11th advance completes the decade
        for (let i = 0; i < 11; i++) {
          results.push(result.current.advanceBead(id).completed)
        }
      })
      return results
    }

    const first = prayDecade()
    expect(first.slice(0, 10).every((c) => !c)).toBe(true)
    expect(first[10]).toBe(true)
    expect(result.current.getRose(id)).toMatchObject({
      currentBead: 0,
      showNewMysteryBanner: false,
      prayedDays: ['2026-11-02'],
    })

    prayDecade()
    expect(result.current.getRose(id)?.prayedDays).toEqual(['2026-11-02'])

    act(() => {
      result.current.advanceBead(id)
      result.current.advanceBead(id)
      result.current.retreatBead(id)
    })
    expect(result.current.getRose(id)?.currentBead).toBe(1)
  })

  it('persists to rosary-roses and survives remount', () => {
    const first = renderHook(() => useRoses())
    act(() => {
      first.result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Luminous1,
        changeDay: firstSunday,
      })
    })
    const saved = first.result.current.roses
    expect(ROSES_KEY).toBe('rosary-roses')
    expect(JSON.parse(localStorage.getItem(ROSES_KEY) ?? 'null')).toEqual(saved)
    first.unmount()

    const second = renderHook(() => useRoses())
    expect(second.result.current.roses).toEqual(saved)
  })

  it('corrupt storage yields an empty list', () => {
    localStorage.setItem(ROSES_KEY, '{not json')
    expect(renderHook(() => useRoses()).result.current.roses).toEqual([])

    localStorage.setItem(ROSES_KEY, '{"a":1}')
    expect(renderHook(() => useRoses()).result.current.roses).toEqual([])

    localStorage.removeItem(ROSES_KEY)
    expect(renderHook(() => useRoses()).result.current.roses).toEqual([])
  })

  it("separate hook instances share roses and never drop each other's writes", () => {
    const a = renderHook(() => useRoses())
    const b = renderHook(() => useRoses())

    // P1: a rose added through B is visible through A
    let idB = ''
    act(() => {
      idB = b.result.current.addRose({
        name: 'B',
        mystery: MysteryTypes.Joyful2,
        changeDay: firstSunday,
      }).id
    })
    expect(a.result.current.getRose(idB)?.name).toBe('B')

    // P2: A's write must not overwrite B's rose with a stale list
    let idA = ''
    act(() => {
      idA = a.result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      }).id
    })
    act(() => {
      a.result.current.advanceBead(idA)
    })
    const stored = JSON.parse(localStorage.getItem(ROSES_KEY) ?? '[]')
    expect(stored.map((r: {id: string}) => r.id)).toEqual([idB, idA])
    expect(a.result.current.roses.map((r) => r.id)).toEqual([idB, idA])
    expect(b.result.current.roses.map((r) => r.id)).toEqual([idB, idA])
    expect(b.result.current.getRose(idA)?.currentBead).toBe(1)

    // P3: a toggle through A re-renders B
    act(() => a.result.current.toggleDay(idB, '2026-10-29'))
    expect(b.result.current.getRose(idB)?.prayedDays).toEqual(['2026-10-29'])
    expect(b.result.current.roses).toBe(a.result.current.roses)
  })

  it('does not touch rosary-intentions', () => {
    localStorage.setItem('rosary-intentions', '"sentinel"')
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    const {result} = renderHook(() => useRoses())
    act(() => {
      const {id} = result.current.addRose({
        name: 'A',
        mystery: MysteryTypes.Joyful1,
        changeDay: firstSunday,
      })
      result.current.toggleDay(id, '2026-10-30')
    })

    // Assert the spies were reached, otherwise the negative checks prove nothing
    expect(getItem).toHaveBeenCalledWith(ROSES_KEY)
    expect(setItem).toHaveBeenCalledWith(ROSES_KEY, expect.any(String))
    expect(getItem).not.toHaveBeenCalledWith('rosary-intentions')
    expect(
      setItem.mock.calls.some(([key]) => key === 'rosary-intentions'),
    ).toBe(false)
    expect(localStorage.getItem('rosary-intentions')).toBe('"sentinel"')
  })
})
