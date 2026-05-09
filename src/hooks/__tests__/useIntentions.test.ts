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

  const expectSaveToBeCalledWith = (mystery: MysteryTypes) =>
    expect(mocks.saveLocalStorageMock).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          currentMystery: mystery,
        }),
      ]),
    )

  it('should pray intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {pray} = result.current

    pray(intention1)

    expectSaveToBeCalledWith(MysteryTypes.Joyful2)
  })

  it('should pray intention and finish', () => {
    const {result} = renderHook(() => useIntentions())
    const {pray} = result.current

    pray(intention2)

    expectSaveToBeCalledWith(MysteryTypes.Complete)
  })

  it('should complete intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {pray} = result.current
    const intention3 = {
      ...intention2,
      currentMystery: MysteryTypes.Glorious5,
    }

    pray(intention3)

    expectSaveToBeCalledWith(MysteryTypes.Complete)
  })

  it('should reset intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {pray} = result.current
    const intention3 = {
      ...intention2,
      currentMystery: MysteryTypes.Complete,
    }
    pray(intention3)

    expectSaveToBeCalledWith(MysteryTypes.Joyful1)
    expect(mocks.saveLocalStorageMock).toBeCalledWith([
      intention1,
      {...intention3, currentMystery: MysteryTypes.Joyful1, completedRosaries: 1},
    ])
  })
})

describe('completedRosaries counter', () => {
  beforeEach(() => {
    mocks.saveLocalStorageMock.mockClear()
  })

  it('increments when prayer cycles Complete → Joyful1', () => {
    const completedIntention = {
      id: 'c1',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Complete,
      completedRosaries: 4,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, completedIntention)

    const {result} = renderHook(() => useIntentions())
    result.current.pray(completedIntention)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'c1',
        currentMystery: MysteryTypes.Joyful1,
        completedRosaries: 5,
      }),
    ])
  })

  it('treats undefined completedRosaries as 0 on first completion', () => {
    const intention = {
      id: 'c2',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Complete,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.pray(intention)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({completedRosaries: 1}),
    ])
  })

  it('does not bump counter mid-rosary', () => {
    const intention = {
      id: 'c3',
      title: 't',
      description: 'd',
      currentMystery: MysteryTypes.Joyful2,
      completedRosaries: 2,
    }
    mocks.intentionListMock.splice(0, mocks.intentionListMock.length, intention)

    const {result} = renderHook(() => useIntentions())
    result.current.pray(intention)

    expect(mocks.saveLocalStorageMock).toHaveBeenCalledWith([
      expect.objectContaining({completedRosaries: 2}),
    ])
  })
})
