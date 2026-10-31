import {act, fireEvent, screen, within} from '@testing-library/react'
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
import {ChangeDay} from 'src/utils/roseChangeDay'

// Rose strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

// October 2026: the 1st is a Thursday, today is Friday the 30th; the first
// Sunday (change day) is the 4th in October and the 6th in September
const NOW = new Date(2026, 9, 30, 12, 0, 0)
const rule: ChangeDay = {kind: 'nthWeekday', nth: 1, weekday: 'sun'}

const baseRose: IRose = {
  id: 'r1',
  name: 'Męska róża',
  mystery: MysteryTypes.Joyful3,
  changeDay: rule,
  lastChange: '2026-10-04',
  prayedDays: ['2026-09-10', '2026-09-11', '2026-10-01', '2026-10-29'],
  showNewMysteryBanner: false,
  currentBead: 0,
}

const seed = (patch: Partial<IRose> = {}) =>
  localStorage.setItem(ROSES_KEY, JSON.stringify([{...baseRose, ...patch}]))

const stored = (): IRose => JSON.parse(localStorage.getItem(ROSES_KEY)!)[0]

const renderAt = (path = '/rose/r1/calendar') =>
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

// Day cells are buttons named after the date, e.g. "4 października, ..."
const day = (n: number, monthGenitive = 'października') =>
  within(screen.getByTestId('rose-calendar-grid')).getByRole('button', {
    name: new RegExp(`^${n} ${monthGenitive}(,|$)`),
  })

const counter = () => screen.getByTestId('rose-calendar-counter')

describe('RoseCalendarTab', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  beforeEach(() => {
    vi.useFakeTimers({toFake: ['Date']})
    vi.setSystemTime(NOW)
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders today card, month header, grid and change-day card in order', () => {
    seed()
    renderAt()

    const tab = screen.getByTestId('rose-calendar-tab')
    const parts = [
      'rose-calendar-today',
      'rose-calendar-header',
      'rose-calendar-grid',
      'rose-calendar-change-card',
    ].map((id) => within(tab).getByTestId(id))
    for (let i = 1; i < parts.length; i++) {
      expect(
        parts[i - 1].compareDocumentPosition(parts[i]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    }

    const [today, header, , changeCard] = parts
    // Today card: outline fish (today not prayed), mystery and counter
    const fish = today.querySelector('svg[data-filled]')
    expect(fish).toHaveAttribute('data-filled', 'false')
    const title = getMystery(MysteryTypes.Joyful3, t).title
    expect(today).toHaveTextContent(title.split(': ')[1])
    expect(counter()).toHaveTextContent('2 z 31 dni w październiku')

    expect(header).toHaveTextContent('Październik 2026')
    expect(
      within(header).getByRole('button', {name: 'Poprzedni miesiąc'}),
    ).toBeInTheDocument()
    expect(
      within(header).getByRole('button', {name: 'Następny miesiąc'}),
    ).toBeInTheDocument()

    expect(changeCard).toHaveTextContent('Dzień zmiany')
    expect(changeCard).toHaveTextContent('Pierwsza niedziela miesiąca')
    // Editing lives in the bottom navigation, the card only shows the rule
    expect(within(changeCard).queryByRole('link')).toBeNull()
    expect(changeCard).not.toHaveTextContent('Zmień')
  })

  it('grid starts on Monday', () => {
    seed()
    renderAt()

    const grid = screen.getByTestId('rose-calendar-grid')
    const dows = within(grid)
      .getAllByTestId('rose-calendar-dow')
      .map((el) => el.textContent)
    expect(dows).toEqual(['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'])

    // 1 October 2026 is a Thursday: three blank cells before it
    const cells = Array.from(grid.children).filter(
      (el) => el.getAttribute('data-testid') !== 'rose-calendar-dow',
    )
    expect(
      cells
        .slice(0, 3)
        .every(
          (el) => el.getAttribute('data-testid') === 'rose-calendar-blank',
        ),
    ).toBe(true)
    expect(cells[3]).toBe(day(1))
    expect(within(grid).getAllByRole('button')).toHaveLength(31)
  })

  it('prayed, unprayed, future and change days are marked', () => {
    seed()
    renderAt()

    const prayed = day(1)
    expect(prayed).toHaveAttribute('data-state', 'prayed')
    expect(prayed).toHaveAccessibleName('1 października, odmówione')
    expect(prayed.querySelector('svg')).toHaveAttribute('data-filled', 'true')

    const unprayed = day(2)
    expect(unprayed).toHaveAttribute('data-state', 'unprayed')
    expect(unprayed.querySelector('svg')).toHaveAttribute(
      'data-filled',
      'false',
    )

    const today = day(30)
    expect(today).toHaveAttribute('data-state', 'unprayed')
    expect(today).toHaveAttribute('data-today', 'true')
    expect(today.querySelector('svg')).toHaveAttribute('data-filled', 'false')

    const future = day(31)
    expect(future).toHaveAttribute('data-state', 'future')
    expect(future).toBeDisabled()
    expect(future.querySelector('svg')).toBeNull()

    const change = day(4)
    expect(change).toHaveAttribute('data-change-day', 'true')
    expect(change).toHaveAccessibleName('4 października, dzień zmiany')
    expect(
      within(change).getByTestId('rose-calendar-change-dot'),
    ).toBeInTheDocument()
    expect(day(5)).not.toHaveAttribute('data-change-day')
    expect(
      within(day(5)).queryByTestId('rose-calendar-change-dot'),
    ).toBeNull()
  })

  it('accents the change-day cell with a primary ring, matched by the legend', () => {
    seed()
    renderAt()

    // A 2px inset ring in the theme's primary colour (the test harness renders
    // with MUI's default theme, so compare shape and cell/legend equality)
    const ring = getComputedStyle(day(4)).boxShadow
    expect(ring).toMatch(/^inset 0 0 0 2px #/)
    expect(getComputedStyle(day(5)).boxShadow).toBe('none')
    expect(
      getComputedStyle(screen.getByTestId('rose-calendar-legend-change'))
        .boxShadow,
    ).toBe(ring)
    // Round swatch, like the near-circular grid cells
    expect(
      getComputedStyle(screen.getByTestId('rose-calendar-legend-change'))
        .borderRadius,
    ).toBe('50%')
  })

  it('a future change day keeps its ring and badge while the day number dims', () => {
    // Friday 2 October: the change day (Sunday the 4th) is still ahead
    vi.setSystemTime(new Date(2026, 9, 2, 12, 0, 0))
    seed({lastChange: '2026-09-06'})
    renderAt()

    const change = day(4)
    expect(change).toHaveAttribute('data-state', 'future')
    expect(change).toHaveAttribute('data-change-day', 'true')
    expect(change).toBeDisabled()
    expect(getComputedStyle(change).boxShadow).toMatch(/^inset 0 0 0 2px #/)

    const badge = within(change).getByTestId('rose-calendar-change-dot')
    expect(badge).toHaveAttribute('data-change-badge')
    expect(getComputedStyle(badge).opacity).not.toBe('0.4')

    const dayNumber = within(change).getByText('4')
    expect(getComputedStyle(dayNumber).opacity).toBe('0.4')
  })

  it('tapping a past day toggles it and updates the counter', () => {
    seed()
    renderAt()
    expect(counter()).toHaveTextContent('2 z 31 dni w październiku')

    fireEvent.click(day(29))
    expect(stored().prayedDays).not.toContain('2026-10-29')
    expect(day(29)).toHaveAttribute('data-state', 'unprayed')
    expect(counter()).toHaveTextContent('1 z 31 dni w październiku')

    fireEvent.click(day(12))
    expect(stored().prayedDays).toContain('2026-10-12')
    expect(day(12)).toHaveAttribute('data-state', 'prayed')
    expect(counter()).toHaveTextContent('2 z 31 dni w październiku')

    // Today too: the today card's fish fills
    fireEvent.click(day(30))
    expect(stored().prayedDays).toContain('2026-10-30')
    expect(counter()).toHaveTextContent('3 z 31 dni w październiku')
    expect(
      screen
        .getByTestId('rose-calendar-today')
        .querySelector('svg[data-filled]'),
    ).toHaveAttribute('data-filled', 'true')
  })

  it('future days are not tappable', () => {
    seed()
    renderAt()

    const future = day(31)
    expect(future).toBeDisabled()
    fireEvent.click(future)
    expect(stored().prayedDays).not.toContain('2026-10-31')
    expect(future).toHaveAttribute('data-state', 'future')
    expect(counter()).toHaveTextContent('2 z 31 dni w październiku')
  })

  it('previous month navigation and disabled next on current month', () => {
    seed()
    renderAt()

    const header = screen.getByTestId('rose-calendar-header')
    const next = within(header).getByRole('button', {name: 'Następny miesiąc'})
    expect(next).toBeDisabled()

    fireEvent.click(
      within(header).getByRole('button', {name: 'Poprzedni miesiąc'}),
    )
    expect(header).toHaveTextContent('Wrzesień 2026')
    expect(next).toBeEnabled()

    // September: its prayed days and its own change date, every day past
    expect(day(10, 'września')).toHaveAttribute('data-state', 'prayed')
    expect(day(12, 'września')).toHaveAttribute('data-state', 'unprayed')
    expect(day(30, 'września')).toHaveAttribute('data-state', 'unprayed')
    expect(day(6, 'września')).toHaveAttribute('data-change-day', 'true')
    expect(
      within(screen.getByTestId('rose-calendar-grid')).getAllByRole('button'),
    ).toHaveLength(30)
    // "we" before the "wrz-" cluster, not "w"
    expect(counter()).toHaveTextContent('2 z 30 dni we wrześniu')

    fireEvent.click(next)
    expect(header).toHaveTextContent('Październik 2026')
    expect(next).toBeDisabled()
    expect(day(4)).toHaveAttribute('data-change-day', 'true')
  })

  it('rolls over to the new day and month at midnight while mounted', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date(2026, 9, 31, 23, 59, 0))
    seed()
    renderAt()
    expect(day(31)).toHaveAttribute('data-today', 'true')

    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000)
    })

    // The calendar followed today into November
    const header = screen.getByTestId('rose-calendar-header')
    expect(header).toHaveTextContent('Listopad 2026')
    expect(day(1, 'listopada')).toHaveAttribute('data-today', 'true')
    expect(day(1, 'listopada')).toBeEnabled()
    expect(
      within(header).getByRole('button', {name: 'Następny miesiąc'}),
    ).toBeDisabled()
  })

  it('picks up a new day when the app resumes', () => {
    vi.setSystemTime(new Date(2026, 9, 29, 21, 0, 0))
    seed({prayedDays: []})
    renderAt()
    expect(day(30)).toBeDisabled()

    // Timers do not run while the PWA sleeps; the resume must refresh today
    vi.setSystemTime(new Date(2026, 9, 30, 7, 0, 0))
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(day(30)).toBeEnabled()
    expect(day(30)).toHaveAttribute('data-today', 'true')
  })
})
