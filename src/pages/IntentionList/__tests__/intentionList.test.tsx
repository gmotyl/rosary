import {renderWithRouter} from 'src/tools/renderWithRouter'
import IntentionList from '../IntentionList'
import {fireEvent} from '@testing-library/react'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {EAuthRoles} from 'src/context/AuthProvider'
import {StylesProvider} from 'src/app/StylesProvider'

jest.mock('../../../hooks', () => ({
  useIntentions: () => ({
    intentions: [
      {
        id: '123',
        userId: '345',
        title: 'title',
        description: 'desc',
      },
    ],
  }),
}))

const Component = () => {
  return (
    <StylesProvider>
      <AuthProviderStub isAuthenticated={true} roles={[EAuthRoles.ROLE_ADMIN]}>
        <IntentionList />
      </AuthProviderStub>
    </StylesProvider>
  )
}

it('should handle opening Delete dialog for logged in user', () => {
  const {getByTestId, getByText} = renderWithRouter(<Component />)

  fireEvent.click(getByTestId('delete-intention'))
  expect(getByText('Delete intention?')).not.toBeNull()
})
it('should not render delete action for unathorised user', () => {
  const {queryByTestId} = renderWithRouter(
    <StylesProvider>
      <AuthProviderStub isAuthenticated={false}>
        <IntentionList />
      </AuthProviderStub>
    </StylesProvider>,
  )

  expect(queryByTestId('delete-intention')).toBeNull()
})
