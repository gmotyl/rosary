import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'
import {screen, within} from '@testing-library/react'

import Header from '../index'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {act, renderHook} from '@testing-library/react-hooks'
import {ROSES_KEY, useRoses} from 'src/hooks'

// The side menu (in the drawer) lists rose names too; assert on the app bar
const appBar = () => within(screen.getByRole('banner'))

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    ROSES_KEY,
    JSON.stringify([
      {
        id: 'r1',
        name: 'Męska róża',
        mystery: MysteryTypes.Joyful1,
        changeDay: {kind: 'dayOfMonth', day: 1},
        lastChange: '2026-10-01',
        prayedDays: [],
        showNewMysteryBanner: false,
        currentBead: 0,
      },
    ]),
  )
})

it('renders the app title', () => {
  const {getAllByText} = renderWithTheme(
    <Router>
      <Header />
    </Router>,
  )
  expect(getAllByText('ROSARY').length).toBeGreaterThan(0)
})

it('header shows the rose name in rose mode', () => {
  renderWithTheme(
    <MemoryRouter initialEntries={['/rose/r1/calendar']}>
      <Header />
    </MemoryRouter>,
  )
  const {getByText, queryByText} = appBar()
  expect(getByText('Męska róża')).toBeInTheDocument()
  expect(queryByText('ROSARY')).not.toBeInTheDocument()
})

it('header shows ROSARY outside rose mode', () => {
  renderWithTheme(
    <MemoryRouter initialEntries={['/how-it-works']}>
      <Header />
    </MemoryRouter>,
  )
  const {getByText, queryByText} = appBar()
  expect(getByText('ROSARY')).toBeInTheDocument()
  expect(queryByText('Męska róża')).not.toBeInTheDocument()
})

it('header title follows a rename done through another useRoses instance', () => {
  renderWithTheme(
    <MemoryRouter initialEntries={['/rose/r1/calendar']}>
      <Header />
    </MemoryRouter>,
  )
  const {getByText, queryByText} = appBar()
  const other = renderHook(() => useRoses())

  act(() => other.result.current.updateRose('r1', {name: 'Żeńska róża'}))

  expect(getByText('Żeńska róża')).toBeInTheDocument()
  expect(queryByText('Męska róża')).not.toBeInTheDocument()
})

it('a long rose name can shrink to ellipsis instead of overflowing', () => {
  renderWithTheme(
    <MemoryRouter initialEntries={['/rose/r1/pray']}>
      <Header />
    </MemoryRouter>,
  )
  // jsdom has no layout: assert the flex item may shrink below its nowrap
  // content (min-width: 0) and clips, so the title's ellipsis can apply
  const slot = appBar().getByTestId('header-title')
  expect(slot).toHaveStyle('min-width: 0; overflow: hidden')
  expect(within(slot).getByText('Męska róża')).toHaveClass(
    'MuiTypography-noWrap',
  )
})
