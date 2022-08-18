jest.mock('src/hooks/useRosaryApi/useAuthTokenRequest')
jest.mock('src/hooks/useRosaryApi/usePostUser')

import React from 'react'
import ReactDOM from 'react-dom'
import {fireEvent} from '@testing-library/react'
import LoginPage from 'src/pages/LoginPage'
import {renderWithRouter} from 'src/tools/renderWithRouter'
import {mockRequest} from 'src/hooks/useRosaryApi/useAuthTokenRequest'

import {mockPostUserRequest} from 'src/hooks/useRosaryApi/usePostUser'

test('Login form calls token request when submitted', async () => {
  const mockSubmit = jest.fn()
  const {container} = renderWithRouter(<LoginPage />)
  const form = container.querySelector('form')
  const {email, password} = form.elements
  const submit = new Event('submit')
  email.value = 'test@test.pl'
  password.value = 'secret'
  fireEvent.submit(form)
  expect(mockRequest).toHaveBeenCalledTimes(1)
  expect(mockRequest).toHaveBeenCalledWith({
    email: 'test@test.pl',
    password: 'secret',
  })
})

test('Register form calls user endpoint when submitted', () => {
  const {container, getByTestId, rerender, debug} = renderWithRouter(
    <LoginPage />,
  )
  const form = getByTestId('register-form')
  const {email, password, password2} = form.elements

  fireEvent.change(email, {target: {value: 'test@test.pl'}})
  fireEvent.change(password, {target: {value: 'secret'}})
  fireEvent.change(password2, {target: {value: 'secret'}})

  fireEvent.submit(form)

  expect(mockPostUserRequest).toHaveBeenCalledTimes(1)
  expect(mockPostUserRequest).toHaveBeenCalledWith({
    email: 'test@test.pl',
    password: 'secret',
  })
})
