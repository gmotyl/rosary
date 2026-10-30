import {fireEvent, screen, within} from '@testing-library/react'
import {MemoryRouter, Route, Switch} from 'react-router-dom'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {RosePage} from '../RosePage'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {ERoutes} from 'src/app/config/routes'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {getMystery} from 'src/consts/rosary'
import {ROSES_KEY} from 'src/hooks'
import type {IRose} from 'src/hooks'
import {PULSE_PATTERNS} from 'src/tools/haptics'
import {
  ChangeDay,
  changeDateInMonth,
  latestChangeDateOnOrBefore,
  toLocalDate,
} from 'src/utils/roseChangeDay'

// Rose strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

const rule: ChangeDay = {kind: 'dayOfMonth', day: 1}
const now = new Date()
const today = toLocalDate(now)
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
// Polish locative of the current month, as the celebration prints it
const monthLabel = () =>
  i18n.t(`rose.monthLocative.${now.getMonth()}`, {lng: 'pl'})

// Change date of the previous month: one change day (this month's 1st) has
// passed since then
const previousChange = () => {
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return changeDateInMonth(rule, d.getFullYear(), d.getMonth())
}

const baseRose: IRose = {
  id: 'r1',
  name: 'Męska róża',
  mystery: MysteryTypes.Joyful1,
  changeDay: rule,
  lastChange: latestChangeDateOnOrBefore(rule, today),
  prayedDays: [],
  showNewMysteryBanner: false,
  currentBead: 0,
}

const seed = (patch: Partial<IRose> = {}) =>
  localStorage.setItem(ROSES_KEY, JSON.stringify([{...baseRose, ...patch}]))

const stored = (): IRose => JSON.parse(localStorage.getItem(ROSES_KEY)!)[0]

const renderAt = (path: string) =>
  renderWithTheme(
    <MemoryRouter initialEntries={[path]}>
      <Switch>
        <Route path={ERoutes.ROSE} component={RosePage} />
      </Switch>
      <Route
        path="*"
        render={({location}) => (
          <div data-testid="location">{location.pathname}</div>
        )}
      />
    </MemoryRouter>,
  )

const t = i18n.getFixedT('pl')
// Title prefix before ": " is the short label, e.g. "2 tajemnica radosna"
const shortTitle = (m: MysteryTypes) => getMystery(m, t).title.split(': ')[0]

const pressKey = (key = 'ArrowRight') => fireEvent.keyDown(window, {key})

describe('RosePrayTab', () => {
  let vibrate: ReturnType<typeof vi.fn>

  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  beforeEach(() => {
    localStorage.clear()
    vibrate = vi.fn(() => true)
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      writable: true,
      value: vibrate,
    })
  })

  afterEach(() => {
    // jsdom has no navigator.vibrate; do not leak the stub
    delete (navigator as {vibrate?: unknown}).vibrate
  })

  it('shows rose mystery heading and its image in the loop', () => {
    seed({mystery: MysteryTypes.Sorrowful3, currentBead: 7})
    renderAt('/rose/r1/pray')

    const heading = screen.getByTestId('rose-mystery-heading')
    expect(
      within(heading).getByText('Twoja tajemnica w tej róży'),
    ).toBeInTheDocument()
    const mystery = getMystery(MysteryTypes.Sorrowful3, t)
    expect(heading).toHaveTextContent(mystery.title.split(': ')[1])

    const loop = screen.getByTestId('rosary-loop')
    const img = within(screen.getByTestId('rosary-image')).getByRole('img')
    expect(img).toHaveAttribute('src', mystery.image)
    // Agreed deviation: the image stays in the centre, no "7 z 10" counter
    expect(loop).not.toHaveTextContent(/\d+\s*z\s*10/)
  })

  it('finishing the decade records today and celebrates', () => {
    seed({currentBead: 10, showNewMysteryBanner: true})
    renderAt('/rose/r1/pray')
    expect(screen.getByTestId('rose-new-mystery-banner')).toBeInTheDocument()

    // Tap the centre image: advance from bead 10 completes the decade
    fireEvent.click(screen.getByTestId('rosary-image'))

    const rose = stored()
    expect(rose.prayedDays).toEqual([today])
    expect(rose.currentBead).toBe(0)
    expect(rose.showNewMysteryBanner).toBe(false)
    expect(vibrate).toHaveBeenCalledWith(PULSE_PATTERNS.decade)

    const celebration = screen.getByTestId('fish-celebration')
    expect(celebration).toHaveTextContent(
      `1 z ${daysInMonth} dni w ${monthLabel()}`,
    )
    expect(screen.queryByTestId('rose-new-mystery-banner')).toBeNull()
    expect(screen.getByTestId('rose-today-status')).toHaveTextContent(
      'Dziś: odmówione',
    )
  })

  it('second decade same day keeps prayed days', () => {
    seed({currentBead: 10, prayedDays: [today]})
    renderAt('/rose/r1/pray')

    // Volume/arrow keys advance through useAdvanceKeys
    pressKey()
    expect(screen.getByTestId('fish-celebration')).toBeInTheDocument()
    expect(stored().currentBead).toBe(0)

    // A key while the celebration is open closes it without advancing
    pressKey()
    expect(screen.queryByTestId('fish-celebration')).toBeNull()
    expect(stored().currentBead).toBe(0)

    // Another full decade: Our Father + 10 Hail Marys, then complete
    for (let i = 0; i < 11; i++) pressKey()
    expect(stored().currentBead).toBe(0)
    expect(stored().prayedDays).toEqual([today])
    expect(screen.getByTestId('fish-celebration')).toHaveTextContent(
      `1 z ${daysInMonth} dni w ${monthLabel()}`,
    )
  })

  it('key dismissing the celebration does not advance a bead', () => {
    seed({currentBead: 10})
    renderAt('/rose/r1/pray')
    fireEvent.click(screen.getByTestId('rosary-image'))
    expect(screen.getByTestId('fish-celebration')).toBeInTheDocument()
    vibrate.mockClear()

    pressKey('Enter')
    expect(screen.queryByTestId('fish-celebration')).toBeNull()
    expect(stored().currentBead).toBe(0)
    expect(vibrate).not.toHaveBeenCalled()

    // Once closed, the next key advances again
    pressKey('Enter')
    expect(stored().currentBead).toBe(1)
  })

  it('banner shows after a change day and links to Zmień', () => {
    seed({lastChange: previousChange()})
    renderAt('/rose/r1/pray')

    const banner = screen.getByTestId('rose-new-mystery-banner')
    expect(banner).toHaveTextContent(
      `Nowa tajemnica: ${shortTitle(MysteryTypes.Joyful2)}`,
    )
    fireEvent.click(within(banner).getByRole('link', {name: 'Zmień'}))
    expect(screen.getByTestId('location')).toHaveTextContent('/rose/r1/edit')
  })

  it('banner gone after dismiss', () => {
    seed({lastChange: previousChange()})
    const {unmount} = renderAt('/rose/r1/pray')

    const banner = screen.getByTestId('rose-new-mystery-banner')
    fireEvent.click(within(banner).getByRole('button', {name: 'Zamknij'}))
    expect(screen.queryByTestId('rose-new-mystery-banner')).toBeNull()
    expect(stored().showNewMysteryBanner).toBe(false)

    // Off for good: a later visit with no new change day shows nothing
    unmount()
    renderAt('/rose/r1/pray')
    expect(screen.queryByTestId('rose-new-mystery-banner')).toBeNull()
  })

  it('no banner without a new change day', () => {
    seed()
    renderAt('/rose/r1/pray')
    expect(screen.getByTestId('rose-mystery-heading')).toBeInTheDocument()
    expect(screen.queryByTestId('rose-new-mystery-banner')).toBeNull()
    expect(stored().mystery).toBe(MysteryTypes.Joyful1)
  })
})
