import IntentionCard from '../IntentionCard'
import {renderWithRouter} from 'src/tools/renderWithRouter'
import {fireEvent} from '@testing-library/react'

it('should display delete icon for ADMIN user in detailed view', () => {
  const intention = {
    id: '123',
    userId: '456',
    title: 'title',
  }
  const onDeleteAction = jest.fn()
  const {getByTestId} = renderWithRouter(
    <IntentionCard intention={intention} onDeleteAction={onDeleteAction} />,
  )
  fireEvent.click(getByTestId('delete-intention'))

  expect(getByTestId('delete-intention')).not.toBeNull()
  expect(onDeleteAction).toHaveBeenCalledTimes(1)
  expect(onDeleteAction).toBeCalledWith('123')
})


