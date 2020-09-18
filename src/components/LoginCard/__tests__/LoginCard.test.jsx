import React from 'react'
import ReactDOM from 'react-dom'
import LoginCard from '../LoginCard'
import {MemoryRouter as Router} from 'react-router-dom'

const mockRequest = jest.fn()

jest.mock('../../../hooks/useRosaryApi', () => ({
  useAuthTokenRequest: () => ({
    state: {isLoading: false, data: {token: ''}},
    requestAuthToken: mockRequest,
    error: {isError: false},
  }),
}))

test('calls submit with the username and password when submitted', async () => {
  const container = document.createElement('div')
  ReactDOM.render(
    <Router>
      <LoginCard />
    </Router>,
    container,
  )
  const form = container.querySelector('form')
  const {email, password} = form.elements
  const submit = new Event('submit')

  email.value = 'test@test.pl'
  password.value = 'secret'
  form.dispatchEvent(submit)

  expect(mockRequest).toHaveBeenCalledTimes(1)
  expect(mockRequest).toHaveBeenCalledWith({
    email: 'test@test.pl',
    password: 'secret',
  })
})

// shows error message
