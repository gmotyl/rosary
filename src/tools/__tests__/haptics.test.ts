import {vi} from 'vitest'
import {
  HAPTICS_STORAGE_KEY,
  PULSE_PATTERNS,
  PulseKind,
  getHapticsEnabled,
  isHapticsSupported,
  pulse,
  resetHapticsMemoryForTests,
  setHapticsEnabled,
} from '../haptics'

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

beforeEach(() => {
  window.localStorage.clear()
  resetHapticsMemoryForTests()
  removeVibrate()
})

afterEach(() => {
  vi.restoreAllMocks()
  removeVibrate()
  window.localStorage.clear()
})

describe('haptics', () => {
  it('pulse vibrates with the pattern for each kind', () => {
    const vibrate = installVibrate()
    const kinds: PulseKind[] = ['bead', 'decade', 'rosary']

    kinds.forEach((kind) => pulse(kind))

    expect(isHapticsSupported()).toBe(true)
    expect(vibrate).toHaveBeenCalledTimes(3)
    expect(vibrate).toHaveBeenNthCalledWith(1, 30)
    expect(vibrate).toHaveBeenNthCalledWith(2, [60, 60, 60])
    expect(vibrate).toHaveBeenNthCalledWith(3, [60, 60, 60, 60, 60])
    kinds.forEach((kind, i) =>
      expect(vibrate).toHaveBeenNthCalledWith(i + 1, PULSE_PATTERNS[kind]),
    )
  })

  it('pulse is a no-op without navigator.vibrate', () => {
    expect('vibrate' in navigator).toBe(false)
    expect(isHapticsSupported()).toBe(false)
    expect(() => pulse('bead')).not.toThrow()
    expect(() => pulse('rosary')).not.toThrow()
  })

  it('haptics are enabled by default', () => {
    expect(window.localStorage.getItem(HAPTICS_STORAGE_KEY)).toBeNull()
    expect(getHapticsEnabled()).toBe(true)
  })

  it('disabled preference persists and silences pulse', () => {
    const vibrate = installVibrate()

    setHapticsEnabled(false)

    expect(HAPTICS_STORAGE_KEY).toBe('rosary-haptics')
    expect(window.localStorage.getItem(HAPTICS_STORAGE_KEY)).not.toBeNull()
    expect(getHapticsEnabled()).toBe(false)
    pulse('bead')
    expect(vibrate).not.toHaveBeenCalled()

    setHapticsEnabled(true)

    expect(getHapticsEnabled()).toBe(true)
    pulse('bead')
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.bead)
  })

  it('storage errors fall back to enabled', () => {
    window.localStorage.setItem(HAPTICS_STORAGE_KEY, 'false')
    const storageGetter = vi
      .spyOn(window, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new Error('SecurityError')
      })

    expect(getHapticsEnabled()).toBe(true)
    expect(() => setHapticsEnabled(false)).not.toThrow()
    // guard against an inert spy: the throwing getter must have been hit
    expect(storageGetter).toHaveBeenCalled()
  })

  it('disabling survives storage failures', () => {
    const vibrate = installVibrate()
    const storageGetter = vi
      .spyOn(window, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new Error('SecurityError')
      })

    setHapticsEnabled(false)

    expect(getHapticsEnabled()).toBe(false)
    pulse('bead')
    expect(vibrate).not.toHaveBeenCalled()
    expect(storageGetter).toHaveBeenCalled()
  })

  it('a failed write still silences pulse over a stale stored value', () => {
    const vibrate = installVibrate()
    window.localStorage.setItem(HAPTICS_STORAGE_KEY, 'true')
    const setItem = vi
      // an instance spy is inert in this jsdom; spy on the prototype
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

    setHapticsEnabled(false)

    // guard against an inert spy: the throwing setItem must have been hit
    expect(setItem).toHaveBeenCalled()
    expect(window.localStorage.getItem(HAPTICS_STORAGE_KEY)).toBe('true')
    expect(getHapticsEnabled()).toBe(false)
    pulse('bead')
    expect(vibrate).not.toHaveBeenCalled()

    setHapticsEnabled(true)

    expect(getHapticsEnabled()).toBe(true)
    pulse('bead')
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.bead)
  })

  it('a stored preference wins over the in-memory one', () => {
    setHapticsEnabled(false)
    // A fresh page load (empty memory) reads the stored value back
    resetHapticsMemoryForTests()
    expect(getHapticsEnabled()).toBe(false)
  })
})
