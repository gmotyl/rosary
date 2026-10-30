import {vi, describe, it, expect, beforeEach, afterEach} from 'vitest'
import {renderHook, act} from '@testing-library/react-hooks'
import {useLocalToday} from '../useLocalToday'

describe('useLocalToday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 30, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('rolls over at local midnight', () => {
    const {result} = renderHook(() => useLocalToday())
    expect(result.current).toBe('2026-10-30')

    act(() => {
      vi.advanceTimersByTime(12 * 60 * 60 * 1000 + 1000)
    })
    expect(result.current).toBe('2026-10-31')
  })

  it('re-arms the midnight timer on resume after a clock jump', () => {
    const {result} = renderHook(() => useLocalToday())

    // Clock / time zone change while the app slept: the wall clock jumps to
    // 23:00 the next day without the pending timer advancing
    act(() => {
      vi.setSystemTime(new Date(2026, 9, 31, 23))
      window.dispatchEvent(new Event('focus'))
    })
    expect(result.current).toBe('2026-10-31')

    // The new local midnight is one hour away, not the stale ~12 h
    act(() => {
      vi.advanceTimersByTime(60 * 60 * 1000 + 1000)
    })
    expect(result.current).toBe('2026-11-01')
  })
})
