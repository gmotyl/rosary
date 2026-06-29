import {fireEvent} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import {vi} from 'vitest'

import {AppRoutes} from 'src/containers/AppRoutes'
import Hero from 'src/components/Hero'
import {renderWithTheme} from 'src/tools/renderWithTheme'

vi.mock('src/pages/PrayPage', () => ({PrayPage: () => <div>Pray page</div>}))

it('renders the pray page at root', () => {
  const {container} = renderWithTheme(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>,
  )
  expect(container.innerHTML).toMatch('Pray page')
})

it('navigates to the how it works page', () => {
  const {container, getByTestId} = renderWithTheme(
    <BrowserRouter>
      <Hero />
      <AppRoutes />
    </BrowserRouter>,
  )

  fireEvent.click(getByTestId('how-it-works'))

  expect(container.innerHTML).toMatch('howItWorks.title')
})
