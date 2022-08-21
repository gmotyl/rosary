import {renderWithRouter} from 'src/tools/renderWithRouter'
import IntentionList from '../IntentionList'
import {fireEvent} from '@testing-library/react'
import {AuthProviderStub} from 'src/tools/AuthProviderStub'
import {EAuthRoles} from 'src/context/AuthProvider'

jest.mock('../../../hooks/useRosaryApi', () => ({
  useIntentionList: () => ({
    intentions: [
      {
        id: '123',
        userId: '345',
        title: 'title',
        description: 'desc',
      },
    ],
  }),
  useDeleteIntention: () => ({deleteIntention: jest.fn()}),
}))

const Component = () => {
  return (
    <AuthProviderStub isAuthenticated={true} roles={[EAuthRoles.ROLE_ADMIN]}>
      <IntentionList />
    </AuthProviderStub>
  )
}

it('should handle opening Delete dialog for logged in user', () => {
  const {getByTestId, getByText} = renderWithRouter(<Component />)

  fireEvent.click(getByTestId('delete-intention'))
  expect(getByText('Delete intention?')).not.toBeNull()
})
it('should not render delete action for unathorised user', () => {
  const {queryByTestId} = renderWithRouter(
    <AuthProviderStub isAuthenticated={false}>
      <IntentionList />
    </AuthProviderStub>,
  )

  expect(queryByTestId('delete-intention')).toBeNull()
})
