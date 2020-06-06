import React from 'react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {render} from '@testing-library/react'

export function renderWithRouter(
  ui: any,
  {
    route: any = '/',
    history = createMemoryHistory({initialEntries: ['/']}),
  } = {},
) {
  const Wrapper = ({children}: any) => (
    <Router history={history}>{children}</Router>
  )
  return {
    ...render(ui, {wrapper: Wrapper}),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  }
}
