import {fireEvent, screen, within} from '@testing-library/react'
import {MemoryRouter, Route, Switch} from 'react-router-dom'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {RosePage} from '../RosePage'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {ERoutes} from 'src/app/config/routes'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ROSES_KEY} from 'src/hooks'
import type {IRose} from 'src/hooks'
import {
  ChangeDay,
  latestChangeDateOnOrBefore,
  toLocalDate,
} from 'src/utils/roseChangeDay'

// Rose strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

const mockApplyChangeDays = vi.fn()

// Real hook, with applyChangeDays observed (and still applied)
vi.mock('src/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('src/hooks')>()
  return {
    ...actual,
    useRoses: () => {
      const api = actual.useRoses()
      return {
        ...api,
        applyChangeDays: (id: string, day?: string) => {
          mockApplyChangeDays(id, day)
          api.applyChangeDays(id, day)
        },
      }
    },
  }
})

const rule: ChangeDay = {kind: 'dayOfMonth', day: 1}
const rose: IRose = {
  id: 'r1',
  name: 'Męska róża',
  mystery: MysteryTypes.Joyful1,
  changeDay: rule,
  lastChange: latestChangeDateOnOrBefore(rule, toLocalDate(new Date())),
  prayedDays: [],
  showNewMysteryBanner: false,
  currentBead: 0,
}

const renderAt = (path: string) =>
  renderWithTheme(
    <MemoryRouter initialEntries={[path]}>
      <Switch>
        <Route path={ERoutes.ROSE} component={RosePage} />
        <Route path={ERoutes.HOME} exact>
          <div data-testid="home" />
        </Route>
      </Switch>
    </MemoryRouter>,
  )

const tabIds = ['rose-pray-tab', 'rose-calendar-tab', 'rose-edit-tab']

describe('RosePage', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(ROSES_KEY, JSON.stringify([rose]))
    mockApplyChangeDays.mockClear()
  })

  it('bottom bar has Modlitwa, Kalendarz, Zmień in order', () => {
    renderAt('/rose/r1/pray')
    const bar = screen.getByTestId('rose-bottom-nav')
    const labels = tabIds.map((id) => within(bar).getByTestId(`${id}-nav`))
    expect(labels.map((l) => l.textContent)).toEqual([
      'Modlitwa',
      'Kalendarz',
      'Zmień',
    ])
    // Document order matches the visual order
    const all = within(bar).getAllByRole('link')
    expect(all).toEqual(labels)
  })

  it('tab follows the URL', () => {
    renderAt('/rose/r1')
    // Bare /rose/:id lands on the Modlitwa tab
    expect(screen.getByTestId('rose-pray-tab')).toBeInTheDocument()
    expect(screen.getByTestId('rose-pray-tab-nav')).toHaveClass('Mui-selected')

    fireEvent.click(screen.getByTestId('rose-calendar-tab-nav'))
    expect(screen.getByTestId('rose-calendar-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('rose-pray-tab')).not.toBeInTheDocument()
    expect(screen.getByTestId('rose-calendar-tab-nav')).toHaveClass(
      'Mui-selected',
    )
    expect(screen.getByTestId('rose-pray-tab-nav')).not.toHaveClass(
      'Mui-selected',
    )

    fireEvent.click(screen.getByTestId('rose-edit-tab-nav'))
    expect(screen.getByTestId('rose-edit-tab')).toBeInTheDocument()
    expect(screen.getByTestId('rose-edit-tab-nav')).toHaveClass('Mui-selected')
  })

  it('unknown rose id redirects home', () => {
    renderAt('/rose/nope/calendar')
    expect(screen.getByTestId('home')).toBeInTheDocument()
    expect(screen.queryByTestId('rose-bottom-nav')).not.toBeInTheDocument()
  })

  it('applies change days on mount', () => {
    renderAt('/rose/r1/pray')
    fireEvent.click(screen.getByTestId('rose-calendar-tab-nav'))
    fireEvent.click(screen.getByTestId('rose-edit-tab-nav'))
    expect(mockApplyChangeDays).toHaveBeenCalledTimes(1)
    expect(mockApplyChangeDays).toHaveBeenCalledWith('r1', undefined)
  })
})
