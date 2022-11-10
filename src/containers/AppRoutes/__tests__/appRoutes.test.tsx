import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {AppRoutes} from 'src/containers/AppRoutes'
import Hero from 'src/components/Hero'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

jest.mock('src/pages/IntentionList', () => () => <div>Intention list</div>)
jest.mock('src/pages/LoginPage', () => () => <div>Login page</div>)
jest.mock('src/pages/AddIntentionPage', () => ({
  AddIntentionPage: () => <div>Add intention page</div>,
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('For not logged user: should not open login form on add intention button click', () => {
  const {container, getByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={false}>
      <BrowserRouter>
        <Hero />
        <AppRoutes />
      </BrowserRouter>
    </AuthProviderStub>,
  )

  expect(container.innerHTML).toMatch('Intention list')

  fireEvent.click(getByTestId('add-intention'))

  expect(container.innerHTML).toMatch('Add intention page')
})

it('For logged user: should open add intention page on add intention button click', () => {})

it('should open "how it works" page ', () => {
  const {container, getByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={false}>
      <BrowserRouter>
        <Hero />
        <AppRoutes />
      </BrowserRouter>
    </AuthProviderStub>,
  )
  fireEvent.click(getByTestId('how-it-works'))

  expect(container.innerHTML).toMatch('How it works')
})
