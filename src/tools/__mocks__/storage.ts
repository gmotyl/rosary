import {vi} from 'vitest'

export const mockGetItem = vi.fn()
export const mockSetItem = vi.fn()
export const mockStorage = {
  getItem: mockGetItem,
  setItem: mockSetItem,
}
export const storage = mockStorage
