import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  REGISTER_MESSAGE,
  TEMPLATE_APP_ID,
  checkRelease,
} from '../scripts/check-release.mjs'

const SCRIPT = fileURLToPath(new URL('../scripts/check-release.mjs', import.meta.url))

const appJson = (app) => ({ configVersion: 'v3', app })

test('template appId is refused with the register message', () => {
  const result = checkRelease(
    appJson({ appId: TEMPLATE_APP_ID, version: { code: 1, name: '1.0.0' } }),
  )
  assert.deepEqual(result, { ok: false, reason: REGISTER_MESSAGE })
})

test('missing appId is refused', () => {
  const result = checkRelease(appJson({ version: { code: 1, name: '1.0.0' } }))
  assert.deepEqual(result, { ok: false, reason: REGISTER_MESSAGE })
})

test('non-integer appId is refused', () => {
  for (const appId of [1.5, 0, -3, NaN, Infinity]) {
    const result = checkRelease(appJson({ appId, version: { code: 1, name: '1.0.0' } }))
    assert.deepEqual(result, { ok: false, reason: REGISTER_MESSAGE }, `appId ${appId}`)
  }
})

test('version must be MAJOR.MINOR.PATCH', () => {
  const result = checkRelease(
    appJson({ appId: 1135873, version: { code: 1, name: '1.0' } }),
  )
  assert.equal(result.ok, false)
  assert.match(result.reason, /1\.0/)
})

test('version components have no leading zeros', () => {
  for (const name of ['01.2.3', '1.02.3', '1.2.03']) {
    const result = checkRelease(appJson({ appId: 1135873, version: { code: 1, name } }))
    assert.equal(result.ok, false, `version ${name}`)
    assert.ok(result.reason.includes(name), `reason names ${name}`)
  }
  for (const name of ['0.1.0', '10.20.30']) {
    const result = checkRelease(appJson({ appId: 1135873, version: { code: 1, name } }))
    assert.deepEqual(result, { ok: true }, `version ${name}`)
  }
})

test('registered appId with 1.0.0 passes', () => {
  const result = checkRelease(
    appJson({ appId: 1135873, version: { code: 1, name: '1.0.0' } }),
  )
  assert.deepEqual(result, { ok: true })
})

test('CLI exits 1 on the template appId', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-release-'))
  const file = join(dir, 'app.json')
  writeFileSync(
    file,
    JSON.stringify(
      appJson({ appId: TEMPLATE_APP_ID, version: { code: 1, name: '1.0.0' } }),
    ),
  )
  const run = spawnSync(process.execPath, [SCRIPT, file], { encoding: 'utf8' })
  assert.equal(run.status, 1)
  assert.ok(run.stderr.includes(REGISTER_MESSAGE), run.stderr)
})

const readJson = (rel) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8'))

test('app.json names version 1.0.0 and vendor motyl.dev', () => {
  const { app } = readJson('../app.json')
  assert.equal(app.version.name, '1.0.0')
  assert.equal(app.version.code, 1)
  assert.equal(app.vender, 'motyl.dev')
  assert.equal(readJson('../package.json').version, '1.0.0')
})

test('app.json holds the Console appId and passes the release guard', () => {
  const appJsonFile = readJson('../app.json')
  assert.equal(appJsonFile.app.appId, 1135873)
  assert.equal(checkRelease(appJsonFile).ok, true)
})
