import {fireEvent} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import {vi} from 'vitest'

import {AppRoutes} from 'src/containers/AppRoutes'
import Hero from 'src/components/Hero'
import {renderWithTheme} from 'src/tools/renderWithTheme'

vi.mock('src/pages/IntentionList', () => ({default: () => <div>Intention list</div>}))
vi.mock('src/pages/AddIntentionPage', () => ({
  AddIntentionPage: () => <div>Add intention page</div>,
}))

it('navigates from intention list to add intention page', () => {
  const {container, getByTestId} = renderWithTheme(
    <BrowserRouter>
      <Hero />
      <AppRoutes />
    </BrowserRouter>,
  )

  expect(container.innerHTML).toMatch('Intention list')

  fireEvent.click(getByTestId('add-intention'))

  expect(container.innerHTML).toMatch('Add intention page')
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
