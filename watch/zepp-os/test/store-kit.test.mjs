import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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
