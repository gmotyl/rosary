/**
 * @jest-environment jsdom
 */

import {act, renderHook} from '@testing-library/react-hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {IIntention} from 'src/pages/IntentionPage/Interface'
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
let intentionList: any = []

// mock localstorage
const mockLocalStorage = {
  getItem: jest.fn(() => JSON.stringify(intentionList)),
  setItem: jest.fn((key, value) => {
    intentionList = JSON.parse(value)
  }),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useIntentionList hook', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should delete intention', () => {
    const {result} = renderHook(() => useIntentions([intention1, intention2]))
    act(() => {
      result.current.deleteIntention(intention1.id)
    })
    expect(result.current.intentions).toEqual([intention2])
  })

  it('should not change number of intentions after pray', () => {
    const {result} = renderHook(() => useIntentions([intention1, intention2]))

    act(() => {
      result.current.pray(intention1)
    })

    expect(result.current.intentions.length).toBe(2)
    expect(result.current.getIntention(intention1.id)?.currentMystery).toBe(
      MysteryTypes.Joyful2,
    )
  })

  it('should save intention', () => {
    const {result} = renderHook(() => useIntentions())
    act(() => {
      result.current.saveIntention(intention1)
    })
    expect(mockLocalStorage.setItem).toBeCalledTimes(1)
    // expect to include instention1
    expect(result.current.intentions).toContain(intention1)
    act(() => {
      result.current.saveIntention(intention2)
    })
    expect(result.current.intentions).toContain(intention2)

    expect(mockLocalStorage.setItem).toBeCalledTimes(2)
  })
})
