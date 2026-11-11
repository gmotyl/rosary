// Release guard: refuses to build a store package from the template appId
// or from a version name that is not MAJOR.MINOR.PATCH.
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const TEMPLATE_APP_ID = 24678
export const REGISTER_MESSAGE =
  'register the app in the Zepp Developer Console and put its appId in app.json'

const SEMVER = /^\d+\.\d+\.\d+$/

export function checkRelease(appJson) {
  const app = appJson?.app ?? {}
  const { appId } = app
  if (!Number.isInteger(appId) || appId <= 0 || appId === TEMPLATE_APP_ID) {
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

// CLI: only when executed directly, not when imported. argv[1] is resolved
// through realpath so a symlinked invocation still counts as a direct run.
function isDirectRun() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isDirectRun()) {
  const path =
    process.argv[2] ?? fileURLToPath(new URL('../app.json', import.meta.url))
  let text
  try {
    text = readFileSync(path, 'utf8')
  } catch (error) {
    console.error(`cannot read ${path}: ${error.message}`)
    process.exit(1)
  }
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    console.error(`cannot parse ${path} as JSON: ${error.message}`)
    process.exit(1)
  }
  const result = checkRelease(parsed)
  if (!result.ok) {
    console.error(result.reason)
    process.exit(1)
  }
}
