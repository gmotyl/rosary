import React from 'react'
import ReactDOM from 'react-dom'
import LoginCard from '../LoginCard'
import {MemoryRouter as Router} from 'react-router-dom'
import {renderWithRouter} from 'src/tools/renderWithRouter'
import {fireEvent, screen} from '@testing-library/react'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {StylesProvider} from 'src/app/StylesProvider'

describe('LoginCard component', () => {
  test.skip('calls submit action', async () => {
    const mockSubmit = jest.fn()
    renderWithRouter(
      <StylesProvider>
        <LoginCard error={{isError: false}} handleSubmit={mockSubmit} />
      </StylesProvider>,
    )
    const form = screen.queryByRole('form')
    const {email, password} = form.elements
    // const submit = new Event('submit')

    email.value = 'test@test.pl'
    password.value = 'secret'
    fireEvent.submit(form)

    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })

  test('calls submit with the username and password when submitted', async () => {
    let emailSpy
    let passwordSpy
    const mockSubmit = (e) => {
      const {email, password} = e.target['elements']
      emailSpy = email
      passwordSpy = password
    }
    const {container} = renderWithRouter(
      <StylesProvider>
        <LoginCard error={{isError: false}} handleSubmit={mockSubmit} />
      </StylesProvider>,
    )

    const form = container.querySelector('form')
    const {email, password} = form.elements
    const submit = new Event('submit')

    email.value = 'test@test.pl'
    password.value = 'secret'
    fireEvent.submit(form)

    expect(emailSpy.value).toEqual(email.value)
    expect(passwordSpy.value).toEqual(password.value)
  })
})
