import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { inflateSync } from 'node:zlib'

// --- Shared, dependency-free PNG reader (reused by later store-kit tests) ---

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

// Bytes per pixel for 8-bit images, keyed by PNG color type.
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }

export const storePath = (rel) =>
  fileURLToPath(new URL(`../store/${rel}`, import.meta.url))

// Parse the PNG chunk stream: header fields plus the concatenated IDAT payload.
export function parsePng(buffer) {
  assert.ok(buffer.subarray(0, 8).equals(PNG_SIGNATURE), 'not a PNG file')
  let offset = 8
  let header = null
  let palette = null
  let transparency = null
  const idat = []
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      }
    } else if (type === 'PLTE') palette = data
    else if (type === 'tRNS') transparency = data
    else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    offset += 12 + length
  }
  assert.ok(header, 'PNG has no IHDR chunk')
  return { ...header, palette, transparency, idat: Buffer.concat(idat) }
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  return pb <= pc ? b : c
}

// Undo the per-scanline filters (None, Sub, Up, Average, Paeth).
export function unfilter(raw, width, height, bpp) {
  const stride = width * bpp
  const out = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const src = y * (stride + 1) + 1
    const dst = y * stride
    const prev = dst - stride
    for (let i = 0; i < stride; i++) {
      const x = raw[src + i]
      const a = i >= bpp ? out[dst + i - bpp] : 0
      const b = y > 0 ? out[prev + i] : 0
      const c = y > 0 && i >= bpp ? out[prev + i - bpp] : 0
      let v
      switch (filter) {
        case 0: v = x; break
        case 1: v = x + a; break
        case 2: v = x + b; break
        case 3: v = x + ((a + b) >> 1); break
        case 4: v = x + paeth(a, b, c); break
        default: throw new Error(`unknown PNG filter type ${filter} on row ${y}`)
      }
      out[dst + i] = v & 0xff
    }
  }
  return out
}

// Decode an 8-bit, non-interlaced PNG into a pixel reader returning RGBA.
export function readPng(path) {
  const png = parsePng(readFileSync(path))
  const { width, height, bitDepth, colorType, interlace } = png
  assert.equal(bitDepth, 8, 'reader supports 8-bit PNGs only')
  assert.equal(interlace, 0, 'reader supports non-interlaced PNGs only')
  const bpp = CHANNELS[colorType]
  const pixels = unfilter(inflateSync(png.idat), width, height, bpp)
  const rgbaAt = (x, y) => {
    const i = (y * width + x) * bpp
    switch (colorType) {
      case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
      case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255]
      case 0: return [pixels[i], pixels[i], pixels[i], 255]
      case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]]
      case 3: {
        const p = pixels[i]
        const alpha = png.transparency && p < png.transparency.length ? png.transparency[p] : 255
        return [png.palette[p * 3], png.palette[p * 3 + 1], png.palette[p * 3 + 2], alpha]
      }
    }
  }
  return { width, height, bitDepth, colorType, rgbaAt }
}

export const corners = ({ width, height }) => [
  [0, 0],
  [width - 1, 0],
  [0, height - 1],
  [width - 1, height - 1],
]

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
    // The round screen fills the image edge to edge: the top-centre pixel is opaque.
    assert.equal(img.rgbaAt(180, 1)[3], 255, `${name} circle does not reach the top edge`)
  }
})

// --- Store listing and privacy statement ---

const LOCALES = ['en-US', 'pl-PL', 'de-DE', 'es-ES', 'fr-FR', 'it-IT']
const COFFEE = 'https://buymeacoffee.com/motyl.dev'

// Split a listing into its `## ` sections, keyed by heading, with trimmed bodies.
export function parseListing(text) {
  const sections = {}
  let current = null
  for (const line of text.split('\n')) {
    const heading = line.match(/^## (.+?)\s*$/)
    if (heading) {
      current = heading[1]
      sections[current] = []
    } else if (current) sections[current].push(line)
  }
  return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.join('\n').trim()]))
}

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
  assert.match(text, /no personal data/i)
  assert.match(text, /network/i)
  assert.match(text, /local storage/i)
  assert.match(text, /uninstall/i)
  assert.match(text, /screen size/i)
  assert.ok(text.includes('https://github.com/gmotyl/rosary'), 'privacy has no contact link')
})
