import {vi} from 'vitest'
import * as storageModule from '../storage'
import {getObject, setObject} from '../repository'
import {PREFIX} from '../../consts/prefix'

vi.mock('../storage')

// vi.mock swaps '../storage' for '../__mocks__/storage'; view it through the mock's type.
const {mockGetItem, mockSetItem} = storageModule as unknown as typeof import('../__mocks__/storage')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('repository', () => {
  const obj = {
    foo: 'test',
    bar: 123,
  }

  it('getObject should use storage with prefix', () => {
    getObject('test-name', {})

    expect(mockGetItem).toBeCalled()
    expect(mockGetItem).toBeCalledWith(PREFIX + 'test-name')
  })

  it('should return object serialized in storage', () => {
    mockGetItem.mockImplementation(() => JSON.stringify(obj))

    const returnedObject = getObject('test-name', {})
    expect(returnedObject).toEqual(obj)
  })

  it('should return default value', () => {
    const defaultObj = {
      foo: 'test default value',
      bar: 999,
    }
    mockGetItem.mockImplementation(() => null)
    const returnedObject = getObject('test-name', defaultObj)
    expect(returnedObject).toEqual(defaultObj)
  })

  it('should save object in storage', () => {
    setObject('test-name', obj)

    expect(mockSetItem).toBeCalled()
    expect(mockSetItem).toBeCalledWith(
      PREFIX + 'test-name',
      JSON.stringify(obj),
    )
  })
})
