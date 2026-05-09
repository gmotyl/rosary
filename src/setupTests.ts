import '@testing-library/jest-dom/vitest'
import {vi} from 'vitest'

// Provide a `jest` global so existing tests written for Jest continue to work
// under Vitest without a wholesale rewrite. `vi` is API-compatible with `jest`
// for the helpers used here (fn, mock, spyOn, clearAllMocks, etc.).
;(globalThis as unknown as {jest: typeof vi}).jest = vi
