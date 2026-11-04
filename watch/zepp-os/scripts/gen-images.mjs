// Renders the watch images into assets/common.r/:
// - fish.png: the ichthys from the approved mockup (two quadratic arcs crossing at the tail, an eye);
// - cross.png: the Latin cross shown for the Glory Be / O my Jesus pause.
// Usage: node scripts/gen-images.mjs
import {writeFileSync} from 'node:fs'
import {deflateSync} from 'node:zlib'
import {fileURLToPath} from 'node:url'

const W = 200
const H = 120
const OX = 100 // shape origin inside the image
const OY = 60
const STROKE = 9
const COLOR = [0x7f, 0xc8, 0xd6]
const EYE = {x: 38, y: -6, r: 6}

// Path from the mockup: M -82 32 Q 0 -72 72 0 Q 0 72 -82 -32
const quads = [
  [[-82, 32], [0, -72], [72, 0]],
  [[72, 0], [0, 72], [-82, -32]],
]

const points = []
for (const [p0, p1, p2] of quads) {
  for (let i = 0; i <= 200; i++) {
    const t = i / 200
    const a = (1 - t) ** 2
    const b = 2 * (1 - t) * t
    const c = t ** 2
    points.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]])
  }
}

function distToPath(x, y) {
  let best = Infinity
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1]
    const [bx, by] = points[i]
    const dx = bx - ax
    const dy = by - ay
    const len2 = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2))
    const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy))
    if (d < best) best = d
  }
  return best
}

// Coverage with a one-pixel soft edge for anti-aliasing.
const cover = (d, half) => Math.max(0, Math.min(1, half + 0.5 - d))

const crcTable = Array.from({length: 256}, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

// Builds an RGBA PNG from a coverage function (0..1 per pixel centre).
function png(w, h, color, coverageAt) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0 // filter: none
    for (let x = 0; x < w; x++) {
      const o = y * (w * 4 + 1) + 1 + x * 4
      raw[o] = color[0]
      raw[o + 1] = color[1]
      raw[o + 2] = color[2]
      raw[o + 3] = Math.round(coverageAt(x + 0.5, y + 0.5) * 255)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const write = (name, data) => {
  const out = fileURLToPath(new URL(`../assets/common.r/${name}`, import.meta.url))
  writeFileSync(out, data)
  console.log(`wrote ${out} (${data.length} bytes)`)
}

write(
  'fish.png',
  png(W, H, COLOR, (px, py) => {
    const sx = px - OX
    const sy = py - OY
    const stroke = cover(distToPath(sx, sy), STROKE / 2)
    const eye = cover(Math.hypot(sx - EYE.x, sy - EYE.y), EYE.r)
    return Math.max(stroke, eye)
  }),
)

// Latin cross: signed distance to two rounded bars, soft one-pixel edge.
const CROSS = {w: 100, h: 140, bar: 14, armY: 42, radius: 3}
const GILT = [0xe7, 0xcf, 0x9b]
const roundedBox = (x, y, cx, cy, hw, hh, r) => {
  const qx = Math.abs(x - cx) - (hw - r)
  const qy = Math.abs(y - cy) - (hh - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
write(
  'cross.png',
  png(CROSS.w, CROSS.h, GILT, (x, y) => {
    const cx = CROSS.w / 2
    const half = CROSS.bar / 2
    const upright = roundedBox(x, y, cx, CROSS.h / 2, half, CROSS.h / 2 - 2, CROSS.radius)
    const arm = roundedBox(x, y, cx, CROSS.armY, CROSS.w / 2 - 2, half, CROSS.radius)
    return Math.max(0, Math.min(1, 0.5 - Math.min(upright, arm)))
  }),
)
