import React from 'react'
// import ReactDOM from 'react-dom'
import {RegisterCard} from '../RegisterCard'
import {MemoryRouter as Router} from 'react-router-dom'
import {render, fireEvent, act} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {usePostUser} from 'src/hooks/useRosaryApi/usePostUser'
import {renderWithRouter} from 'src/tools/renderWithRouter'
import {StylesProvider} from 'src/app/StylesProvider'

const props = {
  handleSubmit: jest.fn(),
  isLoading: false,
  error: {isError: false},
  success: false,
}

const Component = (
  <StylesProvider>
    <RegisterCard {...props} />
  </StylesProvider>
)

test('calls handleSubmit with the username and password when submitted', () => {
  const {container, getByTestId, rerender} = renderWithRouter(Component)
  const form = container.querySelector('form')
  const {email, password, password2} = form.elements
  fireEvent.change(email, {target: {value: 'test@test.pl'}})
  fireEvent.change(password, {target: {value: 'secret'}})
  fireEvent.change(password2, {target: {value: 'secret'}})

  fireEvent.submit(form)

  expect(props.handleSubmit).toHaveBeenCalledTimes(1)
  expect(props.handleSubmit).toHaveBeenCalledWith('test@test.pl', 'secret')
})

it.skip('should render progress bar', () => {
  usePostUser.mockImplementation(() => ({
    isLoading: true,
    error: {isError: false},
    postUser: jest.fn(),
  }))

  const {getByTestId} = renderWithRouter(Component)

  expect(getByTestId('progressbar')).toBeTruthy()
})

// shows error message

test('shows error message', () => {
  const errorProps = {
    ...props,
    error: {isError: true, message: 'error message'},
  }
  const {container, getByTestId, getByText, rerender, debug} = renderWithRouter(
    <StylesProvider>
      <RegisterCard {...errorProps} />
    </StylesProvider>,
  )

  expect(getByText('error message')).toBeTruthy()
})

test('checks password mismatch', () => {
  const {container, getByTestId, getByText, rerender, debug} =
    renderWithRouter(Component)
  const form = container.querySelector('form')
  const {email, password, password2} = form.elements
  fireEvent.change(email, {target: {value: 'test@test.pl'}})
  fireEvent.change(password, {target: {value: 'secret'}})
  fireEvent.change(password2, {target: {value: 'different'}})

  fireEvent.submit(form)
  rerender(Component)

  expect(container).toHaveTextContent('hasła się różnią')
})

test('shows checks if passwords match', () => {
  const {container, getByTestId, queryAllByText, rerender, debug} =
    renderWithRouter(Component)
  const form = container.querySelector('form')
  const {email, password, password2} = form.elements

  fireEvent.submit(form)
  rerender(Component)

  expect(queryAllByText('hasła się różnią').length).toEqual(2)
})
