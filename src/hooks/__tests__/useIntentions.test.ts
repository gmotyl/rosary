import {vi, describe, it, expect, beforeEach} from 'vitest'
import {renderHook} from '@testing-library/react-hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {useIntentions} from '../useIntentions'

// vi.hoisted runs before imports — keep the factory side-effect free.
// intentionListMock is intentionally empty here; beforeEach fills it.
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

const intention1 = {
  id: '123',
  title: 'title',
  description: 'desc',
  currentMystery: MysteryTypes.Joyful1,
}
const intention2 = {
  id: '999',
  title: 'title',
  description: 'desc',
  currentMystery: MysteryTypes.Glorious5,
}

describe('useIntentionList hook', () => {
  beforeEach(() => {
    mocks.saveLocalStorageMock.mockClear()
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention1, intention2)
  })

  it('should return list and save function', () => {
    const {result} = renderHook(() => useIntentions())
    const {intentions, saveIntention} = result.current

    expect(intentions.length).toBe(2)
    expect(saveIntention).toEqual(expect.any(Function))
  })

  it('should save intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {saveIntention} = result.current

    saveIntention(intention1)

    expect(mocks.saveLocalStorageMock).toBeCalledTimes(1)
  })

  it('should delete intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {deleteIntention} = result.current

    deleteIntention(intention1.id)

    expect(mocks.saveLocalStorageMock).toBeCalledWith([intention2])
  })

  it('should get intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {getIntention} = result.current

    const intention = getIntention(intention1.id)

    expect(intention).toEqual(intention1)
  })

})

describe('tapBead', () => {
  it('saves intention with currentBead set to N when N < 10', () => {
    const intention = {
      id: 'a',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Joyful1,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.tapBead(intention, 5)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({id: 'a', currentBead: 5}),
    ])
  })

  it('advances mystery and sets bit when N === 10 and not on Glorious5', () => {
    const intention = {
      id: 'b',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Luminous3,
      currentBead: 9,
      decadesPrayed: 0,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.tapBead(intention, 10)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'b',
        currentMystery: MysteryTypes.Luminous4,
        currentBead: 0,
        decadesPrayed: 1 << (MysteryTypes.Luminous3 - 1),
      }),
    ])
  })

  it('preserves prior bits when advancing decades', () => {
    const priorMask =
      (1 << (MysteryTypes.Joyful1 - 1)) | (1 << (MysteryTypes.Joyful2 - 1))
    const intention = {
      id: 'c',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Joyful3,
      decadesPrayed: priorMask,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.tapBead(intention, 10)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({
        currentMystery: MysteryTypes.Joyful4,
        decadesPrayed: priorMask | (1 << (MysteryTypes.Joyful3 - 1)),
      }),
    ])
  })

  it('increments completedRosaries and resets when all 20 bits become set', () => {
    const allButLast = 0xfffff & ~(1 << (MysteryTypes.Glorious5 - 1))
    const intention = {
      id: 'd',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Glorious5,
      currentBead: 9,
      decadesPrayed: allButLast,
      completedRosaries: 4,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.tapBead(intention, 10)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({
        currentMystery: MysteryTypes.Complete,
        currentBead: 0,
        decadesPrayed: 0,
        completedRosaries: 5,
      }),
    ])
  })

  it('does NOT increment completedRosaries when reaching Glorious5 with skipped decades', () => {
    const intention = {
      id: 'e',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Glorious5,
      currentBead: 9,
      decadesPrayed: 1 << (MysteryTypes.Joyful1 - 1),
      completedRosaries: 0,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.tapBead(intention, 10)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({
        currentMystery: MysteryTypes.Complete,
        decadesPrayed:
          (1 << (MysteryTypes.Joyful1 - 1)) |
          (1 << (MysteryTypes.Glorious5 - 1)),
        completedRosaries: 0,
      }),
    ])
  })
})
