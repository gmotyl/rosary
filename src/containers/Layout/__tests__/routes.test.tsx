import React from 'react'
import {Layout} from '../Layout'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {renderWithTheme} from 'src/tools/renderWithTheme'

jest.mock('src/pages/IntentionList', () => () => <div>Intention list</div>)
jest.mock('src/pages/LoginPage', () => () => <div>Login page</div>)

it('should open login form on login link click', () => {
  const {container, getByText} = renderWithTheme(<Layout />)

  expect(container.innerHTML).toMatch('Intention list')

  fireEvent.click(getByText('Login'))

  expect(container.innerHTML).toMatch('Login page')
})
