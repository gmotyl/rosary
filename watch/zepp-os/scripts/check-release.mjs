// Release guard: refuses to build a store package from the template appId
// or from a version name that is not MAJOR.MINOR.PATCH.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const TEMPLATE_APP_ID = 24678
export const REGISTER_MESSAGE =
  'register the app in the Zepp Developer Console and put its appId in app.json'

const SEMVER = /^\d+\.\d+\.\d+$/

export function checkRelease(appJson) {
  const app = appJson?.app ?? {}
  if (typeof app.appId !== 'number' || app.appId === TEMPLATE_APP_ID) {
    return { ok: false, reason: REGISTER_MESSAGE }
  }
  const name = app.version?.name
  if (typeof name !== 'string' || !SEMVER.test(name)) {
    return {
      ok: false,
      reason: `app.version.name must be MAJOR.MINOR.PATCH, got "${name}"`,
    }
  }
  return { ok: true }
}

// CLI: only when executed directly, not when imported.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const path =
    process.argv[2] ?? fileURLToPath(new URL('../app.json', import.meta.url))
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    console.error(`cannot read ${path}: ${error.message}`)
    process.exit(1)
  }
  const result = checkRelease(parsed)
  if (!result.ok) {
    console.error(result.reason)
    process.exit(1)
  }
}
