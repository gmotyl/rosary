import {renderWithRouter} from 'src/tools/renderWithRouter'
import {SideMenu} from '../SideMenu'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {StylesProvider} from 'src/app/StylesProvider'

describe('sideMenu', () => {
  it('render login option for unauthenticated user ', () => {
    const {getByText, queryByText} = renderWithRouter(
      <AuthProviderStub isAuthenticated={false}>
        <StylesProvider>
          <SideMenu setOpen={jest.fn()} />
        </StylesProvider>
      </AuthProviderStub>,
    )

    expect(getByText('Zaloguj')).toBeTruthy()
    expect(queryByText('Wyloguj')).toBeNull()
  })

  it('render logout option for authenticated user ', () => {
    const {getByText, queryByText} = renderWithRouter(
      <AuthProviderStub isAuthenticated={true}>
        <StylesProvider>
          <SideMenu setOpen={jest.fn()} />
        </StylesProvider>
      </AuthProviderStub>,
    )

    expect(getByText('Wyloguj')).toBeTruthy()
    expect(queryByText('Zaloguj')).toBeNull()
  })

  it('should render add intention link', () => {
    const {getByText} = renderWithRouter(
      <AuthProviderStub isAuthenticated={true}>
        <StylesProvider>
          <SideMenu setOpen={jest.fn()} />
        </StylesProvider>{' '}
      </AuthProviderStub>,
    )
    expect(getByText('Dodaj intencję')).toBeTruthy()
  })
  it('should not render add intention link for unathorised', () => {
    const {queryByText} = renderWithRouter(
      <AuthProviderStub isAuthenticated={false}>
        <StylesProvider>
          <SideMenu setOpen={jest.fn()} />
        </StylesProvider>
      </AuthProviderStub>,
    )
    expect(queryByText('Dodaj intencję')).toBeNull()
  })
})
