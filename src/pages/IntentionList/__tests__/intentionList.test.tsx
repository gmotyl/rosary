import {vi} from 'vitest'
import {renderWithRouter} from 'src/tools/renderWithRouter'
import IntentionList from '../IntentionList'
import {fireEvent} from '@testing-library/react'
import {StylesProvider} from 'src/app/StylesProvider'

vi.mock('../../../hooks', () => ({
  useIntentions: () => ({
    intentions: [
      {
        id: '123',
        title: 'title',
        description: 'desc',
        currentMystery: 1,
      },
    ],
    deleteIntention: vi.fn(),
  }),
}))

const Component = () => (
  <StylesProvider>
    <IntentionList />
  </StylesProvider>
)

it('renders a delete affordance for every intention', () => {
  const {getByTestId} = renderWithRouter(<Component />)
  expect(getByTestId('delete-intention')).toBeTruthy()
})

it('opens the delete dialog when the delete affordance is clicked', () => {
  const {getByTestId, getByText} = renderWithRouter(<Component />)

  fireEvent.click(getByTestId('delete-intention'))
  expect(getByText('intentions.deleteConfirmTitle')).not.toBeNull()
})
