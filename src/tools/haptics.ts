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

// Missing or unreadable preference means haptics are on
export const getHapticsEnabled = (): boolean => {
  try {
    return window.localStorage.getItem(HAPTICS_STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export const setHapticsEnabled = (on: boolean): void => {
  try {
    window.localStorage.setItem(HAPTICS_STORAGE_KEY, String(on))
  } catch {
    // Storage unavailable (private mode, blocked cookies): keep the default
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
