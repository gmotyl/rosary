# Review guide

## Comment format

Every comment starts with a one-sentence **TL;DR** — explain the problem like to
a 5-year-old, no jargon, no identifiers. Then a blank line, then the technical
write-up.

```
**TL;DR:** If you swipe on the picture and let go outside it, the prayer does not move on.

**WARNING:** <technical explanation, trigger sequence, suggested fix>
```

## The app

- Static PWA (Vite), hosted on Cloudflare Workers. No backend, no accounts: all
  state lives in `localStorage`.
- `useIntentions` keeps per-call state (no context): it is called once per
  screen and its actions are passed down. A second call would desync the screen.
- Haptics are best effort: `navigator.vibrate` has duration only, and is missing
  on iOS/Safari, where the switch is hidden and pulses are silent by design.

## Worth your attention

Real findings on past PRs:

- Gestures: release outside the element, `pointercancel`, a second finger, the
  click that follows a drag, keyboard clicks (`detail === 0`) swallowed.
- Global `keydown` handlers firing inside MUI portals (Menu, Select, Dialog,
  Drawer).
- UI that disagrees with storage when `localStorage` throws.
- Effects that return cleanup before updating refs; listeners without teardown.
- Build pins: `.nvmrc` / `packageManager` versions that the toolchain rejects.
- PWA assets: maskable icons cropped by Android's adaptive-icon mask.

## Conventions

- Code, comments and commits in English; "why" comments are welcome.
- Every bugfix ships with a regression test that fails without it.
- Every i18n key exists in all six locales (`en`, `pl`, `de`, `es`, `fr`, `it`).
- jsdom workarounds in tests are intentional (pointer events sent as
  `MouseEvent`; `touch-action` set inline).
- `pnpm lint` does not typecheck — `tsc --noEmit` does. Formatting is Prettier's
  job, not a finding.
- No praise, no restating the diff.
