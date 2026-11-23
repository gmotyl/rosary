import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { corners, parseListing, readPng, storePath } from './helpers/store-kit.mjs'

// --- Store icon ---

test('store icon is 240x240 RGBA', () => {
  const icon = readPng(storePath('icon.png'))
  assert.equal(icon.width, 240)
  assert.equal(icon.height, 240)
  assert.equal(icon.bitDepth, 8)
  assert.equal(icon.colorType, 6)
})

test('store icon corners are transparent', () => {
  const icon = readPng(storePath('icon.png'))
  for (const [x, y] of corners(icon)) {
    assert.equal(icon.rgbaAt(x, y)[3], 0, `corner (${x},${y}) is not transparent`)
  }
})

// --- Store screenshots ---

const SCREENSHOTS = ['01-start', '02-mid-decade', '03-closing-prayers', '04-fish']

test('four store screenshots exist', () => {
  const pngs = readdirSync(storePath('screenshots')).filter((f) => f.endsWith('.png')).sort()
  assert.deepEqual(pngs, SCREENSHOTS.map((n) => `${n}.png`))
  const all = readdirSync(storePath('screenshots')).filter((f) => f !== 'src').sort()
  assert.deepEqual(all, pngs, 'store/screenshots holds only the four PNGs (plus src/)')
})

test('store screenshots are 360x360 RGBA', () => {
  for (const name of SCREENSHOTS) {
    const img = readPng(storePath(`screenshots/${name}.png`))
    assert.equal(img.width, 360, `${name} width`)
    assert.equal(img.height, 360, `${name} height`)
    assert.equal(img.bitDepth, 8, `${name} bit depth`)
    assert.equal(img.colorType, 6, `${name} color type`)
  }
})

test('store screenshot corners are transparent', () => {
  for (const name of SCREENSHOTS) {
    const img = readPng(storePath(`screenshots/${name}.png`))
    for (const [x, y] of corners(img)) {
      assert.equal(img.rgbaAt(x, y)[3], 0, `${name} corner (${x},${y}) is not transparent`)
    }
    // The round screen fills the image edge to edge: every edge midpoint is opaque
    // (>= 200 rather than 255, to allow for anti-aliasing at the rim).
    const mid = (img.width - 1) >> 1
    const edges = [[mid, 0], [mid, img.height - 1], [0, mid], [img.width - 1, mid]]
    for (const [x, y] of edges) {
      assert.ok(img.rgbaAt(x, y)[3] >= 200, `${name} circle does not reach the edge at (${x},${y})`)
    }
  }
})

// --- Store listing and privacy statement ---

const LOCALES = ['en-US', 'pl-PL', 'de-DE', 'es-ES', 'fr-FR', 'it-IT']
const COFFEE = 'https://buymeacoffee.com/motyl.dev'

const readListing = (locale) =>
  parseListing(readFileSync(storePath(`listing/${locale}.md`), 'utf8'))

test('listing exists for all six locales', () => {
  const files = readdirSync(storePath('listing')).sort()
  assert.deepEqual(files, LOCALES.map((l) => `${l}.md`).sort())
  for (const locale of LOCALES) {
    const listing = readListing(locale)
    for (const section of ['Name', 'Short description', 'Description']) {
      assert.ok(listing[section], `${locale} has no "## ${section}" section`)
    }
    const short = listing['Short description']
    assert.ok(!short.includes('\n'), `${locale} short description is not a single line`)
    assert.match(short, /^[^.!?]+[.!?]$/, `${locale} short description is not one sentence`)
  }
})

test('listing name matches the app.json appName', () => {
  const appJson = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'))
  assert.deepEqual(Object.keys(appJson.i18n).sort(), [...LOCALES].sort())
  for (const locale of LOCALES) {
    assert.equal(readListing(locale).Name, appJson.i18n[locale].appName, `${locale} name`)
  }
})

test('every description ends with motyl.dev and the coffee link', () => {
  for (const locale of LOCALES) {
    const lines = readListing(locale).Description.split('\n')
    const last = lines[lines.length - 1]
    assert.ok(last.includes('motyl.dev'), `${locale} last line does not name motyl.dev`)
    assert.ok(last.includes(COFFEE), `${locale} last line has no coffee link`)
  }
})

test('privacy statement exists and names local storage', () => {
  const text = readFileSync(storePath('privacy.md'), 'utf8')
  // Denials, not mere mentions: nothing collected or shared, and no network access.
  assert.match(text, /collects no personal data and shares no data/i)
  assert.match(text, /(no|without|never)[^.]*network/i)
  assert.match(text, /local storage/i)
  assert.match(text, /uninstall/i)
  assert.match(text, /screen size/i)
  assert.ok(text.includes('https://github.com/gmotyl/rosary'), 'privacy has no contact link')
})

// Zepp review rejected v1.0.0 because "Rosary" duplicates an existing store app (appId 1127968).
test('English app name is not the rejected duplicate "Rosary"', () => {
  const appJson = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'))
  for (const [where, name] of [['app.appName', appJson.app.appName], ['i18n.en-US.appName', appJson.i18n['en-US'].appName]]) {
    assert.notEqual(name.trim().toLowerCase(), 'rosary', `${where} is the rejected name "${name}"`)
  }
})

test('English store copy and privacy statement name the app as in app.json', () => {
  const name = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8')).i18n['en-US'].appName
  const privacy = readFileSync(new URL('../store/privacy.md', import.meta.url), 'utf8')
  const texts = { 'en-US description': readListing('en-US').Description, 'privacy.md': privacy }
  for (const [where, text] of Object.entries(texts)) {
    assert.doesNotMatch(text, /\bROSARY\b/, `${where} still calls the app ROSARY`)
    assert.ok(text.includes(name), `${where} never names the app "${name}"`)
  }
})
