import {vi} from 'vitest'

import {renderWithRouter} from 'src/tools/renderWithRouter'
import {SideMenu} from '../SideMenu'
import {StylesProvider} from 'src/app/StylesProvider'

describe('sideMenu', () => {
  it('renders the home link', () => {
    const {getByText} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    expect(getByText('ORARE PRO ME')).toBeTruthy()
  })

  it('renders the add intention link', () => {
    const {getByText} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    expect(getByText('Dodaj intencję')).toBeTruthy()
  })

  it('renders the about and policy links', () => {
    const {getByText} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    expect(getByText('O projekcie')).toBeTruthy()
    expect(getByText('Polityka prywatności')).toBeTruthy()
  })
})
