import {vi, describe, it, expect, beforeEach, afterEach} from 'vitest'
import {renderHook, act} from '@testing-library/react-hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ALL_DECADES_MASK, bitForMystery} from 'src/utils/rosaryGroups'
import {PULSE_PATTERNS} from 'src/tools/haptics'
import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useIntentions} from '../useIntentions'
import {usePrayerNavigation} from '../usePrayerNavigation'

// vi.hoisted runs before imports — keep the factory side-effect free.
const mocks = vi.hoisted(() => ({
  intentionListMock: [] as any[],
  saveLocalStorageMock: vi.fn(),
}))

vi.mock('react-use', () => ({
  useLocalStorage: (_key: string, _defaultValue: any) => [
    mocks.intentionListMock,
    mocks.saveLocalStorageMock,
  ],
}))

const ID = 'nav'

const installVibrate = () => {
  const vibrate = vi.fn(() => true)
  Object.defineProperty(navigator, 'vibrate', {
    configurable: true,
    writable: true,
    value: vibrate,
  })
  return vibrate
}

const removeVibrate = () => {
  // jsdom has no navigator.vibrate; make sure nothing leaks between tests
  delete (navigator as {vibrate?: unknown}).vibrate
}

// Mirrors PrayCard: one useIntentions instance shared with the navigation hook
const renderNavigation = (intention: IIntention) => {
  mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)
  return renderHook(() => {
    const intentions = useIntentions()
    const current = intentions.getIntention(ID)
    return {current, ...usePrayerNavigation(current, intentions)}
  })
}

const base: IIntention = {
  id: ID,
  title: 'title',
  description: 'desc',
  currentMystery: MysteryTypes.Joyful1,
}

describe('usePrayerNavigation', () => {
  let vibrate: ReturnType<typeof installVibrate>

  beforeEach(() => {
    window.localStorage.clear()
    mocks.saveLocalStorageMock.mockClear()
    vibrate = installVibrate()
  })

  afterEach(() => {
    removeVibrate()
  })

  it('advance mid-decade pulses bead', () => {
    const {result} = renderNavigation({...base, currentBead: 4})
    act(() => result.current.advance())
    expect(result.current.current.currentBead).toBe(5)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.bead)
  })

  it('advance past bead 10 pulses decade', () => {
    const {result} = renderNavigation({...base, currentBead: 10, decadesPrayed: 0})
    act(() => result.current.advance())
    expect(result.current.current.currentMystery).toBe(MysteryTypes.Joyful2)
    expect(result.current.current.currentBead).toBe(0)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.decade)
  })

  it('advance completing the rosary pulses rosary', () => {
    // last missing decade is Joyful1: finishing it fills the mask
    const {result} = renderNavigation({
      ...base,
      currentBead: 10,
      decadesPrayed: ALL_DECADES_MASK & ~bitForMystery(MysteryTypes.Joyful1),
    })
    act(() => result.current.advance())
    expect(result.current.current.currentMystery).toBe(MysteryTypes.Complete)
    expect(result.current.isComplete).toBe(true)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.rosary)
  })

  it('advance completing a partial rosary at Glorious5 pulses rosary', () => {
    const {result} = renderNavigation({
      ...base,
      currentMystery: MysteryTypes.Glorious5,
      currentBead: 10,
      decadesPrayed: 0,
    })
    act(() => result.current.advance())
    expect(result.current.current.currentMystery).toBe(MysteryTypes.Complete)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.rosary)
  })

  it('advance on a complete intention is a no-op', () => {
    const {result} = renderNavigation({...base, currentMystery: MysteryTypes.Complete})
    expect(result.current.isComplete).toBe(true)
    act(() => result.current.advance())
    expect(result.current.current.currentMystery).toBe(MysteryTypes.Complete)
    expect(mocks.saveLocalStorageMock).not.toHaveBeenCalled()
    expect(vibrate).not.toHaveBeenCalled()
  })

  it('retreat pulses bead', () => {
    const {result} = renderNavigation({...base, currentBead: 4})
    act(() => result.current.retreat())
    expect(result.current.current.currentBead).toBe(3)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.bead)
  })

  it('retreat at bead 0 is silent', () => {
    const {result} = renderNavigation({...base, currentBead: 0})
    act(() => result.current.retreat())
    expect(result.current.current.currentBead).toBe(0)
    expect(mocks.saveLocalStorageMock).not.toHaveBeenCalled()
    expect(vibrate).not.toHaveBeenCalled()
  })
})
