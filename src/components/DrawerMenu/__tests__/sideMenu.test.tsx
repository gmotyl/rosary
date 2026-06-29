import {vi} from 'vitest'

import {renderWithRouter} from 'src/tools/renderWithRouter'
import {SideMenu} from '../SideMenu'
import {StylesProvider} from 'src/app/StylesProvider'

describe('sideMenu', () => {
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
