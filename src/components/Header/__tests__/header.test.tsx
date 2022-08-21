import Header from '../index'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {renderWithTheme} from 'src/tools/renderWithTheme'

beforeEach(() => {
  jest.clearAllMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render icon for logged in user', () => {
  const {getByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={true}>
      <Router>
        <Header />
      </Router>
    </AuthProviderStub>,
  )

  expect(getByTestId('logged-user')).toBeTruthy()
})
it.skip('should not render icon for not logged user', () => {
  const {queryByTestId} = renderWithTheme(
    <AuthProviderStub isAuthenticated={false}>
      <Router>
        <Header />
      </Router>
    </AuthProviderStub>,
  )
  const icon = queryByTestId('logged-user')
  expect(icon && icon.getAttribute('hidden')).toBeTruthy()
})
