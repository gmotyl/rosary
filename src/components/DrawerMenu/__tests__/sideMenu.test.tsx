import {afterEach, vi} from 'vitest'

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

  afterEach(() => {
    delete (navigator as unknown as {vibrate?: unknown}).vibrate
    localStorage.clear()
  })

  it('side menu shows the switch under the language selector', () => {
    // jsdom has no navigator.vibrate; stub it so the switch renders
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      writable: true,
      value: vi.fn(() => true),
    })
    const {getByRole} = renderWithRouter(
      <StylesProvider>
        <SideMenu setOpen={vi.fn()} />
      </StylesProvider>,
    )
    const language = getByRole('combobox')
    const haptics = getByRole('checkbox', {name: 'hapticsSwitch.label'})
    expect(
      language.compareDocumentPosition(haptics) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
