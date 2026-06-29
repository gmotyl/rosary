# Open and Pray Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the app open directly onto the rosary for the single `default` intention (0 taps to pray), show the mystery's scripture verse below the bead loop, replace navigation chrome with a Reset · Index bottom bar, and apply a devotional claret/gold/parchment theme.

**Architecture:** Reuse the existing `feat/bead-tracker` prayer stack (`PrayCard` → `RosaryHeader` + `DecadeDots` + `RosaryLoop`) unchanged in behavior. Add a verse field to the mystery model, a verse block + Reset/Index bottom bar around `PrayCard` in a new `PrayPage`, and repoint `/` to it. Drop the intention list / accordion page / Hero / Footer tab bar from the routed path. Theme changes are centralized in `app/App.tsx`.

**Tech Stack:** React 18, Vite 6, TypeScript, MUI 5 (`@mui/material`, `makeStyles`), react-i18next (6 locales), Vitest + Testing Library, react-router-dom v5.

**Design doc:** `docs/plans/2026-06-29-open-and-pray-design.md` · **Mockup:** `docs/plans/2026-06-29-open-and-pray-mockup.html`

**Branch:** `feat/simplify-modernize-ui` (based on `feat/bead-tracker`). Run `nvm use 20.19.0` first. Test command: `yarn vitest run <path>` (project uses pnpm/yarn — use `pnpm vitest run` if yarn absent). Full check before done: `pnpm build` (must exit 0).

---

## Task 1: Devotional theme

**Files:**
- Modify: `src/app/App.tsx` (theme `createTheme` block)

**Step 1: Update the theme palette + typography**

Replace the `createTheme({...})` call with:

```tsx
export const theme = createTheme({
  palette: {
    primary: {main: '#6B1438'},      // liturgical claret
    secondary: {main: '#C39A4E'},    // gilt gold
    background: {default: '#F7F3EC', paper: '#FBF8F2'}, // parchment
    text: {primary: '#2A2320', secondary: '#6B6058'},
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    h4: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 600},
    h5: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 600},
    h6: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 700, letterSpacing: '0.18em'},
  },
  shape: {borderRadius: 12},
})
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: exit 0. Visually the app bar + buttons turn claret; background parchment.

**Step 3: Commit**

```bash
git add src/app/App.tsx
git commit -m "feat(theme): claret + gold + parchment devotional palette"
```

---

## Task 2: Verse field on the mystery model

**Files:**
- Modify: `src/consts/rosary.ts` (the `Mystery` interface + `getMystery`)
- Test: `src/consts/__tests__/rosary.test.ts` (create)

**Step 1: Write the failing test**

```ts
import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const t = ((key: string) => key) as any

it('returns the verse i18n key for a mystery', () => {
  const m = getMystery(MysteryTypes.Joyful1, t)
  expect(m.verse).toBe('mysteries.joyful1.verse')
  expect(m.reference).toBe('mysteries.joyful1.description')
})
```

**Step 2: Run it — Expected: FAIL** (`verse` undefined)

Run: `pnpm vitest run src/consts/__tests__/rosary.test.ts`

**Step 3: Implement**

In `src/consts/rosary.ts` add to the `Mystery` interface:

```ts
export interface Mystery {
  type: MysteryTypes
  title: string
  description: string   // scripture reference, e.g. "Lk 1:26-38"
  reference: string     // alias of description, explicit name
  verse: string         // full scripture text
  image: string
}
```

In `getMystery`, for the valid branch return additionally:

```ts
    reference: t(`${baseKey}.description`),
    verse: t(`${baseKey}.verse`),
```

and for the `Complete`/invalid branch: `reference: '', verse: ''`.

**Step 4: Run — Expected: PASS**

**Step 5: Commit**

```bash
git add src/consts/rosary.ts src/consts/__tests__/rosary.test.ts
git commit -m "feat(mystery): expose verse + reference from getMystery"
```

---

## Task 3: Verse text content (en + pl), then remaining locales

**Files:**
- Modify: `src/i18n/locales/en.json`, `pl.json`, `es.json`, `fr.json`, `it.json`, `de.json`

**Step 1:** For every mystery key (`joyful1..5`, `luminous1..5`, `sorrowful1..5`, `glorious1..5`) add a `"verse"` sibling to the existing `"title"`/`"description"`. Keep `description` as the reference.

English source (use a public-domain translation, e.g. Douay-Rheims/RSV-CE phrasing; keep each ≤ ~2 sentences):

```
joyful1:  "Behold, thou shalt conceive in thy womb, and shalt bring forth a son; and thou shalt call his name Jesus."
joyful2:  "Blessed art thou among women, and blessed is the fruit of thy womb."
joyful3:  "She brought forth her firstborn son, and laid him in a manger, because there was no room for them in the inn."
joyful4:  "They carried him to Jerusalem, to present him to the Lord."
joyful5:  "They found him in the temple, sitting in the midst of the doctors, hearing them, and asking them questions."
luminous1: "This is my beloved Son, in whom I am well pleased."
luminous2: "Whatsoever he shall say to you, do ye. This beginning of miracles did Jesus in Cana of Galilee."
luminous3: "The kingdom of God is at hand: repent, and believe the gospel."
luminous4: "His face did shine as the sun: and his garments became white as snow."
luminous5: "This is my body, which is given for you: do this for a commemoration of me."
sorrowful1: "My soul is sorrowful even unto death. Father, not my will, but thine be done."
sorrowful2: "Pilate therefore took Jesus, and scourged him."
sorrowful3: "And platting a crown of thorns, they put it upon his head."
sorrowful4: "Bearing his own cross, he went forth to that place called Calvary."
sorrowful5: "Father, into thy hands I commend my spirit. And bowing his head, he gave up the ghost."
glorious1: "He is risen, he is not here. Behold the place where they laid him."
glorious2: "He was taken up: and a cloud received him out of their sight."
glorious3: "They were all filled with the Holy Ghost, and they began to speak."
glorious4: "Mary hath been taken up into heaven; the angels rejoice."
glorious5: "A great sign appeared in heaven: a woman clothed with the sun, and on her head a crown of twelve stars."
```

**Step 2:** Provide accurate Polish (`pl.json`) verses (user's primary language) — translate the above using a standard Polish Catholic Bible (Biblia Tysiąclecia) phrasing.

**Step 3:** Add `es`, `fr`, `it`, `de` verses using each language's standard Catholic translation. (May be done as a follow-up commit; until present, `t()` falls back to the key — acceptable but not shippable. Mark this task done only when all 6 locales have all 20 verses.)

**Step 4: Validate JSON**

Run: `node -e "['en','pl','es','fr','it','de'].forEach(l=>{const d=require('./src/i18n/locales/'+l+'.json'); ['joyful','luminous','sorrowful','glorious'].forEach(g=>{for(let i=1;i<=5;i++){if(!d.mysteries[g+i].verse)throw new Error(l+' '+g+i)}}); console.log(l,'ok')})"`
Expected: each locale prints `ok`.

**Step 5: Commit**

```bash
git add src/i18n/locales/*.json
git commit -m "feat(i18n): scripture verse text for 20 mysteries (6 locales)"
```

---

## Task 4: Show the verse below the bead loop in PrayCard

**Files:**
- Modify: `src/components/PrayCard/PrayCard.tsx`
- Test: `src/components/PrayCard/__tests__/PrayCard.test.tsx`

**Step 1: Write the failing test** — assert the verse renders for the current mystery.

```tsx
// render PrayCard id="default"; the default intention starts at Joyful1
expect(screen.getByTestId('mystery-verse').textContent).toContain('Jesus')
expect(screen.getByTestId('mystery-reference').textContent).toBeTruthy()
```

(Follow the existing PrayCard test's render setup — it wraps with i18n + theme.)

**Step 2: Run — Expected: FAIL** (no `mystery-verse` node)

**Step 3: Implement** — between `<RosaryLoop .../>` and the trailing `CardContent`, insert a gilt verse block (only when `!isComplete` and `mystery.verse`):

```tsx
{!isComplete && mystery.verse && (
  <Box
    sx={{
      mx: 2, my: 1, px: 2.25, py: 2,
      bgcolor: 'rgba(195,154,78,0.12)',
      borderLeft: '3px solid', borderColor: 'secondary.main',
      borderRadius: 1, textAlign: 'left',
    }}
  >
    <Typography
      data-testid="mystery-verse"
      sx={{fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1.5}}
    >
      “{mystery.verse}”
    </Typography>
    <Typography
      data-testid="mystery-reference"
      sx={{mt: 1, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase',
           color: 'text.secondary', fontWeight: 700}}
    >
      {mystery.reference}
    </Typography>
  </Box>
)}
```

Remove the old `mystery.description` `Typography` (the bare reference) — it's superseded by the block. Add `Box` to the MUI import.

**Step 4: Run — Expected: PASS** (+ existing PrayCard tests still green)

Run: `pnpm vitest run src/components/PrayCard`

**Step 5: Commit**

```bash
git add src/components/PrayCard/
git commit -m "feat(prayer): scripture verse block below the bead loop"
```

---

## Task 5: ResetConfirmDialog + i18n keys

**Files:**
- Create: `src/components/ResetConfirmDialog/ResetConfirmDialog.tsx`, `index.ts`
- Create: `src/components/ResetConfirmDialog/__tests__/ResetConfirmDialog.test.tsx`
- Modify: all 6 `src/i18n/locales/*.json` — add under `prayer`: `resetTitle`, `resetBody`, `resetConfirm`, `cancel`, and `index` (tab label), `resetTab` (tab label).

en.json additions (translate for others):
```
"prayer": { ...,
  "resetTab": "Reset",
  "indexTab": "Index",
  "resetTitle": "Start this rosary over?",
  "resetBody": "Your progress in the current rosary will be cleared. Your lifetime count is kept.",
  "resetConfirm": "Start over"
}
```

**Step 1: Write the failing test** — open dialog, click confirm → `onConfirm` called; click cancel → `onClose` called.

**Step 2: Run — Expected: FAIL**

**Step 3: Implement** — clone `DeleteIntentionDialog` shape with props `{open, onClose, onConfirm}` using the `prayer.reset*` keys; confirm button `color="primary"`.

**Step 4: Run — Expected: PASS**

**Step 5: Commit**

```bash
git add src/components/ResetConfirmDialog/ src/i18n/locales/*.json
git commit -m "feat(prayer): reset-confirm dialog + i18n"
```

---

## Task 6: MysteryIndexSheet (quick-jump to any mystery)

**Files:**
- Create: `src/components/MysteryIndexSheet/MysteryIndexSheet.tsx`, `index.ts`
- Create: `src/components/MysteryIndexSheet/__tests__/MysteryIndexSheet.test.tsx`

**Step 1: Write the failing test**

```tsx
// render open sheet; expect all 4 group headings + 20 mystery rows
expect(screen.getAllByTestId('index-mystery')).toHaveLength(20)
fireEvent.click(screen.getAllByTestId('index-mystery')[6]) // Luminous1
expect(onSelect).toHaveBeenCalledWith(MysteryTypes.Luminous1)
```

**Step 2: Run — Expected: FAIL**

**Step 3: Implement** — a MUI `Drawer anchor="bottom"` (or `Dialog`). Iterate groups in display order `[Joyful, Luminous, Sorrowful, Glorious]`; for each, a heading from `mysteries.groupTitle.<group>` and 5 rows. Build the 20 `MysteryTypes` values `Joyful1..Glorious5` (enum 1..20); each row label = `getMystery(type, t).title`, `data-testid="index-mystery"`, `onClick={() => { onSelect(type); onClose() }}`. Props: `{open, onClose, onSelect: (m: MysteryTypes) => void}`.

**Step 4: Run — Expected: PASS**

**Step 5: Commit**

```bash
git add src/components/MysteryIndexSheet/
git commit -m "feat(prayer): mystery index sheet for quick-jump"
```

---

## Task 7: PrayPage — bead tracker + bottom bar

**Files:**
- Create: `src/pages/PrayPage/PrayPage.tsx`, `index.ts`
- Create: `src/pages/PrayPage/__tests__/PrayPage.test.tsx`

**Step 1: Write the failing test** — renders PrayCard for `default`; Reset tab opens dialog → confirm calls `restart`; Index tab opens sheet → selecting a mystery calls `jumpToMystery`.

(Spy via `useIntentions` — or assert state change: after Reset confirm at a non-start mystery, header returns to Joyful. Prefer a behavioral assertion using the real hook + localStorage.)

**Step 2: Run — Expected: FAIL**

**Step 3: Implement**

```tsx
const DEFAULT_ID = 'default'
export const PrayPage = () => {
  const {t} = useTranslation()
  const {getIntention, restart, jumpToMystery} = useIntentions()
  const intention = getIntention(DEFAULT_ID)
  const [resetOpen, setResetOpen] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  return (
    <Box sx={{display:'flex', flexDirection:'column', minHeight:'calc(100vh - 64px)'}}>
      <Box sx={{flex:1}}><PrayCard id={DEFAULT_ID} /></Box>
      <BottomNavigation showLabels sx={{position:'sticky', bottom:0}}>
        <BottomNavigationAction data-testid="reset-tab" label={t('prayer.resetTab')}
          icon={<RestartAltIcon/>} onClick={() => setResetOpen(true)} />
        <BottomNavigationAction data-testid="index-tab" label={t('prayer.indexTab')}
          icon={<MenuBookIcon/>} onClick={() => setIndexOpen(true)} />
      </BottomNavigation>
      <ResetConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)}
        onConfirm={() => { restart(intention); setResetOpen(false) }} />
      <MysteryIndexSheet open={indexOpen} onClose={() => setIndexOpen(false)}
        onSelect={(m) => jumpToMystery(intention, m)} />
    </Box>
  )
}
```

**Step 4: Run — Expected: PASS**

**Step 5: Commit**

```bash
git add src/pages/PrayPage/
git commit -m "feat(prayer): PrayPage with Reset + Index bottom bar"
```

---

## Task 8: Route `/` to PrayPage; drop list/accordion/add routes

**Files:**
- Modify: `src/containers/AppRoutes/AppRoutes.tsx`
- Modify: `src/containers/AppRoutes/__tests__/appRoutes.test.tsx`

**Step 1: Update the routes test** — replace the now-removed list/add-intention assertions with:

```tsx
vi.mock('src/pages/PrayPage', () => ({PrayPage: () => <div>Pray page</div>}))
it('renders the pray page at root', () => {
  const {container} = renderWithTheme(<BrowserRouter><AppRoutes/></BrowserRouter>)
  expect(container.innerHTML).toMatch('Pray page')
})
it('navigates to how it works', () => { /* keep existing about test */ })
```

Remove the `Hero`/`add-intention` test and its mocks.

**Step 2: Run — Expected: FAIL** (root still renders IntentionList)

**Step 3: Implement** — new `AppRoutes`:

```tsx
<Switch>
  <Route path={ERoutes.HOME} exact component={PrayPage} />
  <Route path={ERoutes.ABOUT} exact component={HowItWorks} />
  <Route path={ERoutes.POLICY} exact component={PrivacyPolicy} />
</Switch>
```

Remove imports/routes for `IntentionList`, `IntentionPage`, `AddIntentionPage`, and the `/intention/:id` route. (Files stay on disk, just unreferenced.)

**Step 4: Run — Expected: PASS**

Run: `pnpm vitest run src/containers/AppRoutes`

**Step 5: Commit**

```bash
git add src/containers/AppRoutes/
git commit -m "feat(routing): open directly on the prayer screen"
```

---

## Task 9: Header modernization + drop Footer tab bar

**Files:**
- Modify: `src/components/Header/Header.tsx`
- Modify: `src/containers/Layout/Layout.tsx`
- Modify: `src/app/config/navigation.ts` (drop `addIntention`, `home` items; keep About, Privacy, language)

**Step 1 (Header):** Remove the `Badge`/"beta" wrapper — wordmark only. Style `AppBar` with `sx={{bgcolor:'background.paper', color:'primary.main', boxShadow:'none', borderBottom:'1px solid #E2D8C6'}}`; keep `DrawerMenu` + `Link to="/"`. Keep wordmark `Typography variant="h6"` (serif via theme). Center the wordmark (`grow` spacers both sides).

**Step 2 (Layout):** Remove `<Footer />` and its import. The bottom bar now lives in `PrayPage`.

**Step 3 (navigation):** Drop `home` and `addIntention` entries so the drawer shows only How it works, Privacy, Language.

**Step 4: Verify** — drawer (hamburger) still opens About/Privacy/language; no bottom Home/＋/ⓘ bar; no "beta".

Run: `pnpm vitest run src/components/DrawerMenu` (existing SideMenu test — update if it asserts dropped items)

**Step 5: Commit**

```bash
git add src/components/Header/ src/containers/Layout/ src/app/config/navigation.ts
git commit -m "feat(chrome): slim claret header, drop beta + bottom tab bar"
```

---

## Task 10: Full verification

**Step 1:** `pnpm vitest run` — entire suite green (fix any test still referencing removed routes/Hero).

**Step 2:** `pnpm build` — Expected: exit 0.

**Step 3:** Manual smoke (`pnpm dev`, open `/`):
- App opens on the beads (no list, no accordion).
- Verse shows under the loop; center shows the mystery image.
- Next advances; bead/image tap advances; decade dots + group ▾ jump.
- Reset → confirm → returns to Joyful 1, lifetime count unchanged.
- Index → sheet of 20 → tap jumps + closes.
- Hamburger → language / About / Privacy.

**Step 4: Commit** any test fixups, then push:

```bash
git push -u origin feat/simplify-modernize-ui
```

---

## Notes for the executor

- `nvm use 20.19.0` before any pnpm/vitest command (Vite 6 needs Node ≥20.19).
- TDD per task: red → green → commit. Don't batch.
- Do NOT delete `IntentionList`/`IntentionPage`/`Hero`/`AddIntentionPage` files — out of scope (follow-up PR).
- `restart`, `jumpToMystery`, `jumpToGroup`, `prayNext`, `prayPrev` already exist in `useIntentions` — reuse, don't reimplement.
- Verse translations (es/fr/it/de) must use each language's standard Catholic Bible; if unsure, flag rather than guess.
