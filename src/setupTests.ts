import '@testing-library/jest-dom/vitest'
import {vi} from 'vitest'

// Provide a `jest` global so existing tests written for Jest continue to work
// under Vitest without a wholesale rewrite. `vi` is API-compatible with `jest`
// for the helpers used here (fn, mock, spyOn, clearAllMocks, etc.).
;(globalThis as unknown as {jest: typeof vi}).jest = vi

// Tests don't import src/i18n; mock react-i18next so any component calling
// useTranslation() gets identity-keyed strings instead of warnings.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      resolvedLanguage: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {type: '3rdParty', init: vi.fn()},
}))
