import {fireEvent, render, screen, within} from '@testing-library/react'
import {MemoryRouter, Route} from 'react-router-dom'
import {useState} from 'react'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {StylesProvider} from 'src/app/StylesProvider'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ROSES_KEY} from 'src/hooks'
import type {IRose} from 'src/hooks'
import {ChangeDay} from 'src/utils/roseChangeDay'
import {
  AddRoseDialog,
  ChangeDayInput,
  formatChangeDay,
  formatChangeDayLong,
} from '..'

// Rose strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

// The probe exposes the current path after navigation
const renderDialog = (onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <StylesProvider>
        <AddRoseDialog open onClose={onClose} />
      </StylesProvider>
      <Route
        path="*"
        render={({location}) => (
          <output data-testid="location">{location.pathname}</output>
        )}
      />
    </MemoryRouter>,
  )

const storedRoses = (): IRose[] =>
  JSON.parse(localStorage.getItem(ROSES_KEY) ?? '[]')

// Part from the header menu, then the mystery from its dot
const pickMystery = (dialog: HTMLElement, part: string, mystery: string) => {
  fireEvent.click(
    within(dialog).getByRole('button', {name: 'Zmień grupę tajemnic'}),
  )
  fireEvent.click(screen.getByRole('menuitem', {name: part}))
  fireEvent.click(within(dialog).getByRole('button', {name: mystery}))
}

describe('AddRoseDialog', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  beforeEach(() => {
    localStorage.clear()
  })

  it('add dialog shows name, 20 mysteries and change day', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})

    expect(within(dialog).getByLabelText('Nazwa')).toBeInTheDocument()

    // Same two-step picker as the normal rosary: part menu, then the dots
    const mystery = within(dialog).getByRole('group', {name: 'Moja tajemnica'})
    expect(
      within(mystery).getByRole('button', {name: 'Zmień grupę tajemnic'}),
    ).toHaveTextContent('Tajemnice radosne')
    expect(within(mystery).getAllByTestId(/^decade-dot-\d$/)).toHaveLength(5)
    expect(
      within(mystery).getByRole('button', {
        name: '1 tajemnica radosna: Zwiastowanie Najświętszej Maryi Pannie',
      }),
    ).toHaveAttribute('aria-current', 'true')

    expect(within(dialog).getByText('Dzień zmiany')).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', {name: 'Dzień tygodnia'}),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', {name: 'Dzień miesiąca'}),
    ).toBeInTheDocument()
  })

  it('change day toggles weekday and day-of-month inputs', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})

    // Weekday mode first: [pierwsza…ostatnia] × [poniedziałek…niedziela]
    const nth = within(dialog).getByLabelText('Który')
    expect(
      within(nth)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['pierwsza', 'druga', 'trzecia', 'czwarta', 'ostatnia'])
    const weekday = within(dialog).getByLabelText('Dzień')
    expect(
      within(weekday)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual([
      'poniedziałek',
      'wtorek',
      'środa',
      'czwartek',
      'piątek',
      'sobota',
      'niedziela',
    ])
    expect(within(dialog).queryByLabelText('Dzień (1–31)')).toBeNull()

    fireEvent.click(
      within(dialog).getByRole('button', {name: 'Dzień miesiąca'}),
    )
    const day = within(dialog).getByLabelText('Dzień (1–31)')
    expect(day).toHaveAttribute('type', 'number')
    expect(day).toHaveAttribute('min', '1')
    expect(day).toHaveAttribute('max', '31')
    expect(within(dialog).queryByLabelText('Który')).toBeNull()
    expect(within(dialog).queryByLabelText('Dzień')).toBeNull()

    fireEvent.click(
      within(dialog).getByRole('button', {name: 'Dzień tygodnia'}),
    )
    expect(within(dialog).getByLabelText('Który')).toBeInTheDocument()
    expect(within(dialog).queryByLabelText('Dzień (1–31)')).toBeNull()
  })

  it('Dodaj disabled for blank name', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})
    const add = within(dialog).getByRole('button', {name: 'Dodaj'})
    const name = within(dialog).getByLabelText('Nazwa')

    expect(add).toBeDisabled()
    fireEvent.change(name, {target: {value: '   '}})
    expect(add).toBeDisabled()
    fireEvent.change(name, {target: {value: 'Męska róża'}})
    expect(add).toBeEnabled()
  })

  it('saving stores the rose and navigates to it', () => {
    const onClose = vi.fn()
    renderDialog(onClose)
    const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})

    fireEvent.change(within(dialog).getByLabelText('Nazwa'), {
      target: {value: '  Męska róża  '},
    })
    pickMystery(dialog, 'Tajemnice bolesne', '2 tajemnica bolesna: Biczowanie Pana Jezusa')
    fireEvent.change(within(dialog).getByLabelText('Który'), {
      target: {value: '2'},
    })
    fireEvent.change(within(dialog).getByLabelText('Dzień'), {
      target: {value: 'sat'},
    })
    fireEvent.click(within(dialog).getByRole('button', {name: 'Dodaj'}))

    const roses = storedRoses()
    expect(roses).toHaveLength(1)
    expect(roses[0]).toMatchObject({
      name: 'Męska róża',
      mystery: MysteryTypes.Sorrowful2,
      changeDay: {kind: 'nthWeekday', nth: 2, weekday: 'sat'},
    })
    expect(screen.getByTestId('location')).toHaveTextContent(
      `/rose/${roses[0].id}/pray`,
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('saves a day-of-month rule', () => {
    renderDialog()
    const dialog = screen.getByRole('dialog', {name: 'Dodaj różę'})
    fireEvent.change(within(dialog).getByLabelText('Nazwa'), {
      target: {value: 'Róża parafialna'},
    })
    fireEvent.click(
      within(dialog).getByRole('button', {name: 'Dzień miesiąca'}),
    )
    fireEvent.change(within(dialog).getByLabelText('Dzień (1–31)'), {
      target: {value: '15'},
    })
    fireEvent.click(within(dialog).getByRole('button', {name: 'Dodaj'}))
    expect(storedRoses()[0].changeDay).toEqual({kind: 'dayOfMonth', day: 15})
  })

  it('ChangeDayInput is controlled by a ChangeDay value', () => {
    const Harness = () => {
      const [rule, setRule] = useState<ChangeDay>({
        kind: 'dayOfMonth',
        day: 7,
      })
      return (
        <>
          <ChangeDayInput value={rule} onChange={setRule} />
          <output data-testid="rule">{JSON.stringify(rule)}</output>
        </>
      )
    }
    render(<Harness />)
    expect(screen.getByLabelText('Dzień (1–31)')).toHaveValue(7)
    fireEvent.change(screen.getByLabelText('Dzień (1–31)'), {
      target: {value: '31'},
    })
    expect(screen.getByTestId('rule')).toHaveTextContent(
      '{"kind":"dayOfMonth","day":31}',
    )
  })

  it('formats change day rules as text', () => {
    const t = i18n.getFixedT('pl')
    expect(
      formatChangeDay({kind: 'nthWeekday', nth: 2, weekday: 'sat'}, t),
    ).toBe('druga sobota')
    expect(
      formatChangeDay({kind: 'nthWeekday', nth: 1, weekday: 'mon'}, t),
    ).toBe('pierwszy poniedziałek')
    expect(
      formatChangeDay({kind: 'nthWeekday', nth: 'last', weekday: 'fri'}, t),
    ).toBe('ostatni piątek')
    expect(formatChangeDay({kind: 'dayOfMonth', day: 15}, t)).toBe(
      '15. dzień miesiąca',
    )
  })

  it('formats change day rules as a capitalized standalone label', () => {
    const t = i18n.getFixedT('pl')
    expect(
      formatChangeDayLong({kind: 'nthWeekday', nth: 1, weekday: 'sun'}, t),
    ).toBe('Pierwsza niedziela miesiąca')
    expect(formatChangeDayLong({kind: 'dayOfMonth', day: 15}, t)).toBe(
      '15. dzień miesiąca',
    )
  })

  it('suffixes the French day of month as an ordinal', () => {
    const t = i18n.getFixedT('fr')
    expect(formatChangeDay({kind: 'dayOfMonth', day: 1}, t)).toBe(
      '1er jour du mois',
    )
    expect(formatChangeDay({kind: 'dayOfMonth', day: 2}, t)).toBe(
      '2e jour du mois',
    )
    expect(formatChangeDay({kind: 'dayOfMonth', day: 21}, t)).toBe(
      '21e jour du mois',
    )
  })

  it('keeps the base day of month rule in locales without ordinal forms', () => {
    expect(
      formatChangeDay({kind: 'dayOfMonth', day: 1}, i18n.getFixedT('en')),
    ).toBe('day 1 of the month')
    expect(
      formatChangeDay({kind: 'dayOfMonth', day: 2}, i18n.getFixedT('it')),
    ).toBe('2° giorno del mese')
  })
})
