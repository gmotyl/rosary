import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Header from '../index'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ROSES_KEY} from 'src/hooks'

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
  const {getByText, queryByText} = renderWithTheme(
    <MemoryRouter initialEntries={['/rose/r1/calendar']}>
      <Header />
    </MemoryRouter>,
  )
  expect(getByText('Męska róża')).toBeInTheDocument()
  expect(queryByText('ROSARY')).not.toBeInTheDocument()
})

it('header shows ROSARY outside rose mode', () => {
  const {getByText, queryByText} = renderWithTheme(
    <MemoryRouter initialEntries={['/how-it-works']}>
      <Header />
    </MemoryRouter>,
  )
  expect(getByText('ROSARY')).toBeInTheDocument()
  expect(queryByText('Męska róża')).not.toBeInTheDocument()
})
