export type PulseKind = 'bead' | 'decade' | 'rosary'

// Mirrors the `rosary-language` key used by i18n language detection
export const HAPTICS_STORAGE_KEY = 'rosary-haptics'

export const PULSE_PATTERNS: Record<PulseKind, number | number[]> = {
  bead: 15,
  decade: [30, 60, 30],
  rosary: [30, 60, 30, 60, 30],
}

export const isHapticsSupported = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

// Last preference set in this session. Storage stays the source of truth
// when it works; this copy keeps a toggle effective when storage throws or
// silently fails to persist (private mode, blocked cookies, quota).
let memoryPreference: boolean | null = null

// Test-only: simulate a fresh page load with no in-session preference
export const resetHapticsMemoryForTests = (): void => {
  memoryPreference = null
}

// Missing or unreadable preference means haptics are on
export const getHapticsEnabled = (): boolean => {
  try {
    const stored = window.localStorage.getItem(HAPTICS_STORAGE_KEY)
    if (stored !== null) return stored !== 'false'
  } catch {
    // Storage unreadable: fall through to the in-session preference
  }
  return memoryPreference ?? true
}

export const setHapticsEnabled = (on: boolean): void => {
  memoryPreference = on
  try {
    window.localStorage.setItem(HAPTICS_STORAGE_KEY, String(on))
  } catch {
    // Storage unavailable: the in-memory preference still applies
  }
}

// All failures are silent: unsupported API or disabled preference means no vibration
export const pulse = (kind: PulseKind): void => {
  if (!isHapticsSupported() || !getHapticsEnabled()) return
  try {
    navigator.vibrate(PULSE_PATTERNS[kind])
  } catch {
    // Some browsers throw when vibration is blocked by policy; ignore
  }
}
