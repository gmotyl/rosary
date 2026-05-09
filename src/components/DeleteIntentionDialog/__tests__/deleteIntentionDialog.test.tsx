import {fireEvent} from '@testing-library/react'
import {vi} from 'vitest'

import {DeleteIntentionDialog} from '../index'
import {renderWithTheme} from 'src/tools/renderWithTheme'

it('should show dialog', () => {
  const {getByText} = renderWithTheme(
    <DeleteIntentionDialog
      open={true}
      handleClose={vi.fn()}
      onDelete={vi.fn()}
    />,
  )

  expect(getByText('intentions.deleteConfirmTitle')).not.toBeNull()
})

it('should execute actions dialog', () => {
  const handleClose = vi.fn()
  const onDelete = vi.fn()
  const {getByText} = renderWithTheme(
    <DeleteIntentionDialog
      open={true}
      handleClose={handleClose}
      onDelete={onDelete}
    />,
  )
  fireEvent.click(getByText('intentions.cancel'))
  fireEvent.click(getByText('intentions.delete'))

  expect(handleClose).toHaveBeenCalledTimes(1)
  expect(onDelete).toHaveBeenCalledTimes(1)
})
