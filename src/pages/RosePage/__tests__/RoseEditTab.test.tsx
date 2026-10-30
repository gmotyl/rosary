import {act, fireEvent, screen, within} from '@testing-library/react'
import {MemoryRouter, Route, Switch} from 'react-router-dom'
import type {RouteComponentProps} from 'react-router-dom'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {RosePage} from '../RosePage'
import {splitTitle} from '../RosePrayTab'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {ERoutes} from 'src/app/config/routes'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {getMystery} from 'src/consts/rosary'
import {ROSES_KEY} from 'src/hooks'
import type {IRose} from 'src/hooks'
import {SideMenu} from 'src/components/DrawerMenu/SideMenu'
import {ChangeDay} from 'src/utils/roseChangeDay'

// Rose strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

// Today is Friday 30 October 2026; the first Sunday (change day) was the 4th
// and the next one is 1 November
const NOW = new Date(2026, 9, 30, 12, 0, 0)
const rule: ChangeDay = {kind: 'nthWeekday', nth: 1, weekday: 'sun'}

const baseRose: IRose = {
  id: 'r1',
  name: 'Męska róża',
  mystery: MysteryTypes.Joyful3,
  changeDay: rule,
  lastChange: '2026-10-04',
  prayedDays: ['2026-10-01'],
  showNewMysteryBanner: false,
  currentBead: 0,
}

const seed = (patch: Partial<IRose> = {}) =>
  localStorage.setItem(ROSES_KEY, JSON.stringify([{...baseRose, ...patch}]))

const storedRoses = (): IRose[] => JSON.parse(localStorage.getItem(ROSES_KEY)!)
const stored = (): IRose => storedRoses()[0]

// Same-tab navigation, as the side menu or a browser back would do it
let routerHistory: RouteComponentProps['history']

const renderAt = (path = '/rose/r1/edit') =>
  renderWithTheme(
    <MemoryRouter initialEntries={[path]}>
      <div data-testid="menu">
        <SideMenu setOpen={vi.fn()} />
      </div>
      <Switch>
        <Route path={ERoutes.ROSE} component={RosePage} />
      </Switch>
      <Route
        path="*"
        render={({location, history}) => {
          routerHistory = history
          return <div data-testid="location">{location.pathname}</div>
        }}
      />
    </MemoryRouter>,
  )

const t = i18n.getFixedT('pl')

const row = (id: 'name' | 'mystery' | 'changeDay') =>
  screen.getByTestId(`rose-edit-${id}`)

// Each "Zmień" button is named after its row, e.g. "Zmień Nazwa"
const changeButtonName = {
  name: 'Zmień Nazwa',
  mystery: 'Zmień Tajemnica',
  changeDay: 'Zmień Dzień zmiany',
}

const openEditor = (id: 'name' | 'mystery' | 'changeDay', title: string) => {
  fireEvent.click(
    within(row(id)).getByRole('button', {name: changeButtonName[id]}),
  )
  return screen.getByRole('dialog', {name: title})
}

describe('RoseEditTab', () => {
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

  it('shows Nazwa, Tajemnica, Dzień zmiany rows and delete', () => {
    seed()
    renderAt()

    const tab = screen.getByTestId('rose-edit-tab')
    const rows = [row('name'), row('mystery'), row('changeDay')]
    const del = within(tab).getByRole('button', {name: 'Usuń różę'})

    expect(rows[0]).toHaveTextContent('Nazwa')
    expect(rows[0]).toHaveTextContent('Męska róża')
    expect(rows[1]).toHaveTextContent('Tajemnica')
    const {label, name} = splitTitle(getMystery(MysteryTypes.Joyful3, t).title)
    expect(rows[1]).toHaveTextContent(`${label} — ${name}`)
    expect(rows[2]).toHaveTextContent('Dzień zmiany')
    expect(rows[2]).toHaveTextContent('Pierwsza niedziela miesiąca')
    // Three visible "Zmień" buttons, each with a distinct accessible name
    // that still starts with its visible text (label in name)
    const fields = ['name', 'mystery', 'changeDay'] as const
    fields.forEach((field, i) => {
      const button = within(rows[i]).getByRole('button', {
        name: changeButtonName[field],
      })
      expect(button).toHaveTextContent(/^Zmień$/)
    })
    expect(
      within(tab).queryAllByRole('button', {name: 'Zmień'}),
    ).toHaveLength(0)

    // Visual order: Nazwa, Tajemnica, Dzień zmiany, then "Usuń różę"
    const order = [...rows, del]
    for (let i = 1; i < order.length; i++) {
      expect(
        order[i - 1].compareDocumentPosition(order[i]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    }
  })

  it('renames the rose', () => {
    seed()
    renderAt()

    const dialog = openEditor('name', 'Zmień nazwę')
    const input = within(dialog).getByLabelText('Nazwa')
    const save = within(dialog).getByRole('button', {name: 'Zapisz'})
    expect(input).toHaveValue('Męska róża')

    // A blank name cannot be saved
    fireEvent.change(input, {target: {value: '   '}})
    expect(save).toBeDisabled()
    fireEvent.click(save)
    expect(stored().name).toBe('Męska róża')

    fireEvent.change(input, {target: {value: '  Róża św. Józefa '}})
    expect(save).toBeEnabled()
    fireEvent.click(save)

    expect(stored().name).toBe('Róża św. Józefa')
    expect(row('name')).toHaveTextContent('Róża św. Józefa')
    expect(
      within(screen.getByTestId('menu')).getByText('Róża św. Józefa'),
    ).toBeInTheDocument()
  })

  it('changing mystery does not advance', () => {
    seed()
    const {unmount} = renderAt()

    const dialog = openEditor('mystery', 'Zmień tajemnicę')
    const select = within(dialog).getByLabelText('Tajemnica')
    expect(within(select).getAllByRole('option')).toHaveLength(20)
    fireEvent.change(select, {
      target: {value: String(MysteryTypes.Sorrowful2)},
    })
    fireEvent.click(within(dialog).getByRole('button', {name: 'Zapisz'}))

    expect(stored().mystery).toBe(MysteryTypes.Sorrowful2)
    expect(stored().lastChange).toBe('2026-10-04')
    const {label} = splitTitle(getMystery(MysteryTypes.Sorrowful2, t).title)
    expect(row('mystery')).toHaveTextContent(label)

    // Re-entering the rose the same day runs applyChangeDays: no advance
    unmount()
    renderAt('/rose/r1/pray')
    expect(stored().mystery).toBe(MysteryTypes.Sorrowful2)
    expect(stored().showNewMysteryBanner).toBe(false)
  })

  it('changing rule keeps the mystery', () => {
    seed()
    const {unmount} = renderAt()

    const dialog = openEditor('changeDay', 'Zmień dzień zmiany')
    // The change-day inputs shared with AddRoseDialog
    expect(
      within(dialog).getByRole('button', {name: 'Dzień tygodnia'}),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(within(dialog).getByLabelText('Który')).toHaveValue('1')
    fireEvent.click(
      within(dialog).getByRole('button', {name: 'Dzień miesiąca'}),
    )
    fireEvent.change(within(dialog).getByLabelText('Dzień (1–31)'), {
      target: {value: '15'},
    })
    fireEvent.click(within(dialog).getByRole('button', {name: 'Zapisz'}))

    expect(stored().changeDay).toEqual({kind: 'dayOfMonth', day: 15})
    // Recomputed to the latest change date on or before today, no advance
    expect(stored().lastChange).toBe('2026-10-15')
    expect(stored().mystery).toBe(MysteryTypes.Joyful3)
    expect(row('changeDay')).toHaveTextContent('15. dzień miesiąca')

    unmount()
    renderAt('/rose/r1/pray')
    expect(stored().mystery).toBe(MysteryTypes.Joyful3)
    expect(stored().showNewMysteryBanner).toBe(false)
  })

  it('delete asks for confirmation and goes home', () => {
    seed()
    renderAt()
    expect(
      within(screen.getByTestId('menu')).getByText('Męska róża'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: 'Usuń różę'}))
    const dialog = screen.getByRole('dialog', {name: 'Usunąć różę?'})
    expect(dialog).toHaveTextContent('Męska róża')
    // Nothing is deleted before the confirmation
    expect(storedRoses()).toHaveLength(1)

    fireEvent.click(within(dialog).getByRole('button', {name: 'Usuń'}))

    expect(storedRoses()).toEqual([])
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
    expect(
      within(screen.getByTestId('menu')).queryByText('Męska róża'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('rose-edit-tab')).not.toBeInTheDocument()
  })

  it('cancel keeps the rose', () => {
    seed()
    renderAt()

    fireEvent.click(screen.getByRole('button', {name: 'Usuń różę'}))
    const dialog = screen.getByRole('dialog', {name: 'Usunąć różę?'})
    fireEvent.click(within(dialog).getByRole('button', {name: 'Anuluj'}))

    expect(storedRoses()).toHaveLength(1)
    expect(stored()).toEqual(baseRose)
    expect(screen.getByTestId('location')).toHaveTextContent('/rose/r1/edit')
    expect(screen.getByTestId('rose-edit-tab')).toBeInTheDocument()
  })

  it('an open edit draft does not follow navigation to another rose', () => {
    localStorage.setItem(
      ROSES_KEY,
      JSON.stringify([baseRose, {...baseRose, id: 'r2', name: 'Żeńska róża'}]),
    )
    renderAt()

    const dialog = openEditor('name', 'Zmień nazwę')
    fireEvent.change(within(dialog).getByLabelText('Nazwa'), {
      target: {value: 'Szkic dla r1'},
    })

    act(() => {
      routerHistory.push('/rose/r2/edit')
    })

    // r2 opens fresh: no dialog carrying r1's draft that could save into r2
    expect(
      screen.queryByRole('dialog', {name: 'Zmień nazwę'}),
    ).not.toBeInTheDocument()
    expect(row('name')).toHaveTextContent('Żeńska róża')
    expect(storedRoses().map((r) => r.name)).toEqual([
      'Męska róża',
      'Żeńska róża',
    ])
  })
})
