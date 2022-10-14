import {renderHook} from '@testing-library/react-hooks'
import {useIntentions} from '../useIntentions'

const intention1 = {
  id: '123',
  title: 'title',
  description: 'desc',
}
const intention2 = {
  id: '999',
  title: 'title',
  description: 'desc',
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
})
