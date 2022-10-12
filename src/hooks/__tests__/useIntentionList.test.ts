import {renderHook} from '@testing-library/react-hooks'
import {useIntentionList} from '../useIntentionList'

const saveLocalStorageMock = jest.fn()
const useLocalStorageMock = (key: string, defaulValue: any) => {
  return [defaulValue, saveLocalStorageMock]
}

jest.mock('react-use', () => ({
  useLocalStorage: useLocalStorageMock,
}))

describe('useIntentionList hook', () => {
  it('should return empty list and save function', () => {
    const {result} = renderHook(() => useIntentionList())
    const {intentionList, saveIntentionList} = result.current

    expect(intentionList.length).toBe(0)
    expect(saveIntentionList).toEqual(expect.any(Function))
  })

  it('should save list', () => {
    const {result} = renderHook(() => useIntentionList())
    const {intentionList, saveIntentionList} = result.current
    const intention1 = {
      title: 'title',
      description: 'desc',
    }
    const intention2 = {
      title: 'title',
      description: 'desc',
    }

    expect(intentionList.length).toBe(0)

    saveIntentionList([intention1])

    expect(saveLocalStorageMock).toBeCalledTimes(1)
  })
})
