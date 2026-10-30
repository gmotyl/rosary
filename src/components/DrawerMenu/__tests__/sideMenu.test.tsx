import {fireEvent, screen, within} from '@testing-library/react'
import {MemoryRouter, Route} from 'react-router-dom'
import {afterEach, vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {render} from '@testing-library/react'
import {SideMenu} from '../SideMenu'
import {StylesProvider} from 'src/app/StylesProvider'
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

// MemoryRouter (not renderWithRouter: its history v5 breaks router v5's
// useLocation after a push); the probe exposes the current path
const renderMenu = (path = '/', setOpen = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <StylesProvider>
        <SideMenu setOpen={setOpen} />
      </StylesProvider>
      <Route
        path="*"
        render={({location}) => (
          <output data-testid="location">{location.pathname}</output>
        )}
      />
    </MemoryRouter>,
  )

const currentPath = () => screen.getByTestId('location').textContent

const rule: ChangeDay = {kind: 'dayOfMonth', day: 1}
const today = toLocalDate(new Date())
const makeRose = (id: string, name: string, prayedDays: string[]): IRose => ({
  id,
  name,
  mystery: MysteryTypes.Joyful1,
  changeDay: rule,
  lastChange: latestChangeDateOnOrBefore(rule, today),
  prayedDays,
  showNewMysteryBanner: false,
  currentBead: 0,
})

describe('sideMenu', () => {
  afterEach(() => {
    delete (navigator as unknown as {vibrate?: unknown}).vibrate
    localStorage.clear()
  })

  // Pre-existing assertions are written against translation keys
  describe('settings and links', () => {
    beforeEach(async () => {
      await i18n.changeLanguage('cimode')
    })

    it('renders the about and policy links', () => {
      const {getByText} = renderMenu()
      expect(getByText('menu.howItWorks')).toBeTruthy()
      expect(getByText('menu.privacyPolicy')).toBeTruthy()
    })

    it('no empty menu row without vibration support', () => {
      const {container, queryByRole} = renderMenu()
      expect(queryByRole('checkbox', {name: 'hapticsSwitch.label'})).toBeNull()
      const emptyItems = Array.from(container.querySelectorAll('li')).filter(
        (li) => li.childElementCount === 0,
      )
      expect(emptyItems).toHaveLength(0)
    })

    it('side menu shows the switch under the language selector', () => {
      // jsdom has no navigator.vibrate; stub it so the switch renders
      Object.defineProperty(navigator, 'vibrate', {
        configurable: true,
        writable: true,
        value: vi.fn(() => true),
      })
      const {getByRole} = renderMenu()
      const language = getByRole('combobox')
      const haptics = getByRole('checkbox', {name: 'hapticsSwitch.label'})
      expect(
        language.compareDocumentPosition(haptics) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })
  })

  describe('roses', () => {
    beforeEach(async () => {
      await i18n.changeLanguage('pl')
      localStorage.setItem(
        ROSES_KEY,
        JSON.stringify([
          makeRose('r1', 'Męska róża', [today]),
          makeRose('r2', 'Róża parafialna', ['2020-01-01']),
        ]),
      )
    })

    const follows = (a: Node, b: Node) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

    it('menu lists Różaniec, roses in order, then + Dodaj różę', () => {
      renderMenu()
      const block = screen.getByTestId('rose-menu')
      const rows = Array.from(block.children)
      expect(
        rows.map((row) => row.tagName === 'HR' || row.textContent),
      ).toEqual([
        'Różaniec',
        true,
        'Męska róża',
        'Róża parafialna',
        'Dodaj różę',
      ])
      // "+" sign of the add row
      expect(within(rows[4] as HTMLElement).getByTestId('AddIcon')).toBeTruthy()

      // About / Policy and the settings stay below the rose block
      const add = screen.getByText('Dodaj różę')
      expect(follows(add, screen.getByText('Jak odmawiać różaniec'))).toBe(true)
      expect(follows(add, screen.getByText('Polityka prywatności'))).toBe(true)
      expect(follows(add, screen.getByTestId('dark-mode-toggle'))).toBe(true)
      // The old "Módl się" entry is replaced by "Różaniec"
      expect(screen.queryByText('Módl się')).toBeNull()
    })

    it('menu shows fish only on roses prayed today', () => {
      renderMenu()
      const prayed = screen.getByRole('link', {name: /Męska róża/})
      const notPrayed = screen.getByRole('link', {name: /Róża parafialna/})
      const fish = within(prayed).getByRole('img', {name: 'Dziś odmówione'})
      expect(fish).toHaveAttribute('data-filled', 'true')
      expect(within(notPrayed).queryByRole('img')).toBeNull()
      expect(screen.getAllByRole('img', {name: 'Dziś odmówione'})).toHaveLength(
        1,
      )
    })

    it('rose rows open the rose prayer', () => {
      const setOpen = vi.fn()
      renderMenu('/', setOpen)
      fireEvent.click(screen.getByText('Róża parafialna'))
      expect(currentPath()).toBe('/rose/r2/pray')
      expect(setOpen).toHaveBeenCalledWith(false)
    })

    it('Różaniec opens the intention prayer', () => {
      const intentions = JSON.stringify([{id: 'i1', name: 'Za rodzinę'}])
      localStorage.setItem('rosary-intentions', intentions)
      const setOpen = vi.fn()
      renderMenu('/rose/r1/pray', setOpen)

      fireEvent.click(screen.getByText('Różaniec'))

      expect(currentPath()).toBe('/')
      expect(setOpen).toHaveBeenCalledWith(false)
      expect(localStorage.getItem('rosary-intentions')).toBe(intentions)
    })

    it('+ Dodaj różę opens the add dialog and keeps the menu open', () => {
      const setOpen = vi.fn()
      renderMenu('/', setOpen)
      fireEvent.click(screen.getByText('Dodaj różę'))
      const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})
      expect(within(dialog).getByLabelText('Nazwa')).toBeInTheDocument()
      expect(
        within(dialog).getByLabelText('Moja tajemnica'),
      ).toBeInTheDocument()
      expect(within(dialog).getByText('Dzień zmiany')).toBeInTheDocument()
      expect(setOpen).not.toHaveBeenCalledWith(false)
    })
  })
})
