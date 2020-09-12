import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {DeleteIntentionDialog} from '../index'

it('should show dialog', () => {
  const {getByText} = render(
    <DeleteIntentionDialog
      open={true}
      handleClose={jest.fn()}
      onDelete={jest.fn()}
    />,
  )

  expect(getByText('Delete intention?')).not.toBeNull()
})

it('should execute actions dialog', () => {
  const handleClose = jest.fn()
  const onDelete = jest.fn()
  const {getByText} = render(
    <DeleteIntentionDialog
      open={true}
      handleClose={handleClose}
      onDelete={onDelete}
    />,
  )
  fireEvent.click(getByText('Cancel'))
  fireEvent.click(getByText('Delete'))

  expect(handleClose).toHaveBeenCalledTimes(1)
  expect(onDelete).toHaveBeenCalledTimes(1)
})
