import React from 'react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {AppRoutes} from 'src/containers/AppRoutes'
import Hero from 'src/components/Hero'
import {LoginWrapper} from 'src/tools/LoginWrapper'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {renderWithTheme} from 'src/tools/renderWithTheme'

jest.mock('src/pages/IntentionList', () => () => <div>Intention list</div>)
jest.mock('src/pages/LoginPage', () => () => <div>Login page</div>)
jest.mock('src/pages/AddIntentionPage', () => ({
  AddIntentionPage: () => <div>Add intention page</div>,
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('For not logged user: should not open login form on add intention button click', () => {
  const history = createMemoryHistory()
  const {container, getByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={false}>
      <Router history={history}>
        <Hero />
        <AppRoutes />
      </Router>
    </AuthProviderStub>,
  )

  expect(container.innerHTML).toMatch('Intention list')

  fireEvent.click(getByTestId('add-intention'))

  expect(container.innerHTML).toMatch('Add intention page')
})

it('For logged user: should open add intention page on add intention button click', () => {
  const history = createMemoryHistory()
  const Component = (
    <AuthProviderStub isAuthenticated={true}>
      <Router history={history}>
        <Hero />
        <AppRoutes />
      </Router>
    </AuthProviderStub>
  )
  const {container, getByTestId} = renderWithTheme(Component)

  expect(container.innerHTML).toMatch('Intention list')

  fireEvent.click(getByTestId('add-intention'))

  expect(container.innerHTML).toMatch('Add intention page')
})

it('should open "how it works" page ', () => {
  const history = createMemoryHistory()
  const {container, getByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={false}>
      <Router history={history}>
        <Hero />
        <AppRoutes />
      </Router>
    </AuthProviderStub>,
  )
  fireEvent.click(getByTestId('how-it-works'))

  expect(container.innerHTML).toMatch('How it works')
})
