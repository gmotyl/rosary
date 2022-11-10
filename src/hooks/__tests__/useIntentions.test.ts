import {renderHook} from '@testing-library/react-hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {useIntentions} from '../useIntentions'

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
const intentionListMock = [intention1, intention2]

const saveLocalStorageMock = jest.fn()
const useLocalStorageMock = (key: string, defaulValue: any) => {
  return [intentionListMock, saveLocalStorageMock]
}

jest.mock('react-use', () => ({
  useLocalStorage: useLocalStorageMock,
}))

describe('useIntentionList hook', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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

    expect(saveLocalStorageMock).toBeCalledTimes(1)
  })

  it('should delete intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {deleteIntention} = result.current

    deleteIntention(intention1.id)

    expect(saveLocalStorageMock).toBeCalledWith([intention2])
  })

  it('should get intention', () => {
    const {result} = renderHook(() => useIntentions())
    const {getIntention} = result.current

    const intention = getIntention(intention1.id)

    expect(intention).toEqual(intention1)
  })

  const expectSaveToBeCalledWith = (mystery: MysteryTypes) =>
    expect(saveLocalStorageMock).toBeCalledWith(
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

    // expect(saveLocalStorageMock).toBeCalledTimes(1)
    expectSaveToBeCalledWith(MysteryTypes.Joyful2)
  })

  it('should pray intention and finish', () => {
    const {result} = renderHook(() => useIntentions())
    const {pray} = result.current

    pray(intention2)

    // expect(saveLocalStorageMock).toBeCalledTimes(1)
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
    expect(saveLocalStorageMock).toBeCalledWith([
      intention1,
      {...intention3, currentMystery: MysteryTypes.Joyful1},
    ])
  })
})
