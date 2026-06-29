# Open and Pray — UI simplification + modernization

> Status: approved design · 2026-06-29
> Branch: `feat/simplify-modernize-ui` (based on `feat/bead-tracker`)

## Problem

Reaching the rosary today takes too many taps and feels complicated:
`Home (hero + intention cards)` → tap **Dalej** → `IntentionPage` (two accordions:
Intention open, Prayer closed) → tap **Pray a decade** → the beads finally show.
The homepage also leads with a wall-of-text hero, a "beta" badge, and a generic
bottom tab bar (Home / + / ⓘ).

The user prays effectively **one** intention. The prayer screen itself (the rotating
bead loop from `feat/bead-tracker`) is good and stays.

## Goal

Open the app **directly onto the rosary** — zero taps to pray — and give the whole
app a deliberate, devotional visual identity.

## Decisions (locked)

- **Single intention.** Collapse to the seeded `default` intention as the single
  backing store. No intention list, no add-intention flow in the main path.
- **Drop the intention line.** No "praying for X" text — a pure rosary screen.
- **Reset = start current rosary over** (`restart()`), behind a confirm dialog.
  Lifetime "rosaries prayed" count is untouched.
- **Verse below the beads** (Option 2): full scripture text in a gilt-edged block
  beneath the loop, with a small-caps reference. Requires adding 20 verse texts × 6 locales.
- **Center of the loop keeps each mystery's own picture** (`mystery.image`,
  `/img/{type}.jpg`) — unchanged from `RosaryLoop`.
- Branch sits on `feat/bead-tracker`; lands stacked on / after that PR.

## Screen layout (the only main screen)

```
┌─────────────────────────────┐
│ ☰        • ROSARY •          │  top bar: claret wordmark + hamburger
│                             │
│      Joyful Mysteries ▾      │  mystery group (tap to change) — RosaryHeader
│       The Annunciation      │  mystery title
│        ● ○ ○ ○ ○            │  decade dots — DecadeDots (jump within group)
│                             │
│         ╱  (photo) ╲         │  RosaryLoop — large; center = mystery image;
│        ●           ●         │  OF gold bead + 10 claret HM beads;
│         ╲         ╱          │  tap bead / image to advance; fills the stage
│                             │
│  ❝ Hail, full of grace…❞    │  verse block (gilt left-border) + reference
│     LUKE 1:28–31            │
│                             │
│      [   NEXT ▸▸   ]         │  primary action
│   ↺ Reset    │   ☰ Index     │  bottom bar (2 actions)
└─────────────────────────────┘
```

## Component / routing changes

| Area | Change |
|------|--------|
| `containers/AppRoutes` | `/` → new `PrayPage` rendering `PrayCard` for `default`. Remove `IntentionList` (HOME), `IntentionPage`, `/add-intention` routes. Keep `/how-it-works`, `/policy`. |
| `containers/Layout` | Drop the `Footer` tab bar; the new in-screen bottom bar lives in `PrayPage`. Keep `Header`. |
| `components/Header` | Modernize: parchment surface + claret wordmark + gold dots; remove "beta" badge; hamburger → drawer (language switcher, About, Privacy). |
| `components/PrayCard` | Render the verse block below `RosaryLoop`; make the loop fill available height; remove the standalone restart-on-complete button (Reset handles it). |
| **New** `components/PrayPage` (or page) | Composes Header + PrayCard for `default` + bottom bar (Reset, Index). |
| **New** `components/MysteryIndexSheet` | Bottom sheet / dialog listing all 4 groups × 5 mysteries; tap → `jumpToMystery` + close. |
| **New** `components/ResetConfirmDialog` | Confirm → `restart(intention)`. (Reuse `DeleteIntentionDialog` pattern.) |
| `app/App` theme | primary `#6B1438`, secondary `#C39A4E`; parchment background `#F7F3EC`; serif display (`Georgia` stack, offline-safe) for headings, sans body. |
| `consts/rosary` + `i18n` | Add full verse text per mystery (new key e.g. `mysteries.<k>.verse`) across en/pl/es/fr/it/de. Keep `description` as the reference. |
| `IntentionList` / `IntentionPage` / `Hero` / `AddIntentionPage` | Left in repo, unreferenced — deleted in a follow-up PR (lower risk now). |

## Data model

`useIntentions` and the `default` intention seed are unchanged. The screen binds to
`getIntention('default')`. Existing actions reused as-is: `prayNext`, `prayPrev`,
`jumpToMystery`, `jumpToGroup`, `restart`, `completeDecade`.

## Visual language

- **Color:** parchment `#F7F3EC`, liturgical claret `#6B1438`, gilt gold `#C39A4E`,
  wood-bead browns, ink `#2A2320`.
- **Type:** Georgia/serif display for devotional gravity; system sans for UI/body.
- **Signature:** the bead loop — gold Our-Father bead, claret Hail-Mary beads,
  the mystery's own image at the center.

## Testing

- Update `appRoutes.test`: `/` renders the prayer screen (not `IntentionList`).
- New: Reset action opens confirm → `restart` resets `currentMystery`/`currentBead`/`decadesPrayed`,
  preserves `completedRosaries`.
- New: Index sheet renders 20 mysteries; selecting one calls `jumpToMystery` and closes.
- New: verse text renders for the current mystery and changes with the mystery.
- Existing `PrayCard` / `RosaryLoop` / `DecadeDots` / `RosaryHeader` tests stay green.

## Out of scope

- Full removal of multi-intention code (follow-up).
- Sourcing/curating verse translations beyond a first correct pass per locale.
