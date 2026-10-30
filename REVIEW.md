# Review guide

Instructions for automated PR reviewers (Kilo) on this repo.

## Comment format

Every comment starts with a one-sentence **TL;DR** — explain the problem like to
a 5-year-old, no jargon, no identifiers. Then a blank line, then the technical
write-up.

```
**TL;DR:** If you swipe on the picture and let go outside it, the prayer does not move on.

**WARNING:** <technical explanation, trigger sequence, suggested fix>
```

## Mistakes to avoid

Reviewers made these on our other repos and the findings were declined — do not
repeat them here:

- **Invented repo rules.** Cite a convention only if you can quote it verbatim
  with its file path. This repo has no `AGENTS.md`; the only written rules are
  in this file.
- **Invented line numbers / unread code.** Read the whole component or hook, and
  its callers, before claiming a guard or cleanup is missing.
- **Misquoted external specs.** Do not paraphrase Pointer Events,
  `navigator.vibrate` or other web specs from memory — quote them or leave them
  out.
- **Inflated severity.** Severity is about what a real user on a real device can
  reach, not what a partial test mock can produce.
- **Designed behaviour flagged as a defect.** Read the PR description first; if
  a decision is stated there, argue with the decision, don't report it as a bug.
- **Impossible races.** The browser runs our code on one thread: adjacent
  synchronous statements cannot interleave. A race finding must give a concrete
  event order one user can trigger.
- **Same issue, one level deeper, every round.** If a follow-up round only finds
  a narrower variant of an already-fixed edge case, say so and rate it by real
  reach instead of repeating the severity.

## What is worth your attention

These were real, verified findings on this repo — keep finding them:

- Pointer gesture lifecycle: release outside the element (a mouse has no
  implicit capture), `pointercancel`, secondary pointers, and the `click` that
  follows a drag.
- Suppression flags that outlive their gesture and swallow a later, unrelated
  activation — especially keyboard-generated clicks (`detail === 0`).
- Global `keydown` listeners reacting inside MUI portals (Menu, Select, Dialog,
  Drawer) or on interactive targets that already have native behaviour.
- UI state that diverges from what is persisted when `localStorage` throws or is
  full.
- Missing cleanup: `window` listeners, timers, effects without a teardown.
- Hooks called after an early return.
- Tests that mock away the very path the fix is about, or that pass without the
  fix.

## Conventions

- Code, comments and commit messages are in English. Explanatory "why" comments
  are the house style.
- Every bugfix ships with a regression test that fails without it.
- `useIntentions` keeps per-call state (no context): call it once per screen and
  pass its actions down. Suggesting a second call inside a child hook is a bug,
  not a cleanup.
- Haptics are best effort: `navigator.vibrate` has duration only (no intensity)
  and is missing on iOS / Safari, where the haptics switch is hidden and pulses
  are silent by design.
- Every new i18n key exists in all six locales (`en`, `pl`, `de`, `es`, `fr`,
  `it`).
- jsdom workarounds in tests are intentional: pointer events are dispatched as
  `MouseEvent` because jsdom's `PointerEvent` drops `clientX`/`clientY`, and
  `touch-action` is set inline because jsdom drops it from stylesheets.
- Gate: `pnpm test`, `pnpm lint` (ESLint, errors only — it does not typecheck),
  `tsc --noEmit`, `pnpm build`. Formatting is Prettier's job, not a review
  finding.
- Keep it short: no praise, no restating the diff, no style nits a formatter
  would catch.
