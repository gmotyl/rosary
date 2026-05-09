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
    expect(getByText('menu.home')).toBeTruthy()
  })

  it('renders the add intention link', () => {
    const {getByText} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    expect(getByText('menu.addIntention')).toBeTruthy()
  })

  it('renders the about and policy links', () => {
    const {getByText} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    expect(getByText('menu.howItWorks')).toBeTruthy()
    expect(getByText('menu.privacyPolicy')).toBeTruthy()
  })
})
