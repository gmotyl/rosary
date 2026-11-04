# ROSARY for Zepp OS

Watch version of ROSARY for Amazfit Zepp OS watches, built and tested first on the **T-Rex 3 Pro**
(round AMOLED, 480×480 / 466×466, API_LEVEL 4.2). A separate npm package: the web app's pnpm,
Vite, ESLint and Vitest setup does not touch this folder.

## What it does (iteration 1)

- A ring of 11 beads around the screen edge: one Our Father bead and ten Hail Marys, with a
  two-slot gap on each side of the Our Father.
- Same motion as the web `RosaryLoop`: each tap turns the whole ring one slot in 400 ms
  (`cubic-bezier(0.4, 0, 0.2, 1)`), the current bead always sits at the bottom and pulses
  (1.18×, 1.4 s). Prayed beads are filled claret, beads still to pray are outlined.
- The centre counts finished decades (`n / 5`) and names the current prayer.
- After the tenth Hail Mary a fish (ichthys) swims across with a short message, then the ring
  turns on to the next Our Father. After the fifth decade the fish stays with
  "Różaniec ukończony / Chwała Panu!"; the next tap starts over.
- Progress is saved in `localStorage`, so leaving the app keeps your place.
- No mystery selection yet.

## Controls

| Input | Action |
| --- | --- |
| Tap anywhere | Next bead |
| Swipe up / down / left | Next bead |
| Swipe right | System default (leave the app) |
| Select or Down button | Next bead |
| Up button | Back one bead |

A light vibration on every bead; a double buzz when a decade is done.

## Develop

```sh
npm install
npm test             # ring logic (node --test)
npx zeus build       # → dist/*.zab
npx zeus login       # once
npx zeus preview     # pick the device, scan the QR in Zepp App
```

Scan from Zepp App: **Device → General → Developer Mode → + → Scan**. Developer Mode itself is
switched on under Profile → Settings → About (tap the Zepp icon 7 times).

`assets/common.r/fish.png` is generated: `npm run fish`.

### Zeus CLI quirk

Zeus 1.9.3 is a local devDependency. It loads its private `zeppos-app-utils` through
`module-alias`, which reads `_moduleAliases` from **this** `package.json`; without that entry
every `zeus` command dies with `Cannot find module 'zeppos-app-utils'`. The CLI also offers API
levels up to 4.0 only, so `app.json` targets 4.0 (the T-Rex 3 Pro runs 4.2).

## Layout

| Path | What |
| --- | --- |
| `page/home/rosary.js` | Pure ring logic (slots, rotation, advance/back, easing, pulse); no `@zos` imports |
| `page/home/index.page.js` | Widgets, timers, input, vibration, storage |
| `page/i18n/*.po` | English and Polish strings |
| `test/rosary.test.mjs` | Node tests for the ring logic |
| `scripts/gen-fish.mjs` | Draws the fish PNG |
