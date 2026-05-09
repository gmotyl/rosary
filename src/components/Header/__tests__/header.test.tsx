import {BrowserRouter as Router} from 'react-router-dom'

import Header from '../index'
import {renderWithTheme} from 'src/tools/renderWithTheme'

it('renders the app title', () => {
  const {getAllByText} = renderWithTheme(
    <Router>
      <Header />
    </Router>,
  )
  expect(getAllByText('ORARE PRO ME').length).toBeGreaterThan(0)
})
