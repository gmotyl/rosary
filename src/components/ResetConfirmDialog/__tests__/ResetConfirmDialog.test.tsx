import {fireEvent} from '@testing-library/react'
import {vi} from 'vitest'

import {ResetConfirmDialog} from '../index'
import {renderWithTheme} from 'src/tools/renderWithTheme'

it('should show dialog', () => {
  const {getByText} = renderWithTheme(
    <ResetConfirmDialog open={true} onClose={vi.fn()} onConfirm={vi.fn()} />,
  )

  expect(getByText('prayer.resetTitle')).not.toBeNull()
  expect(getByText('prayer.resetBody')).not.toBeNull()
})

it('should call onConfirm when confirm button clicked', () => {
  const onConfirm = vi.fn()
  const onClose = vi.fn()
  const {getByText} = renderWithTheme(
    <ResetConfirmDialog open={true} onClose={onClose} onConfirm={onConfirm} />,
  )

  fireEvent.click(getByText('prayer.resetConfirm'))

  expect(onConfirm).toHaveBeenCalledTimes(1)
  expect(onClose).not.toHaveBeenCalled()
})

it('should call onClose when cancel button clicked', () => {
  const onConfirm = vi.fn()
  const onClose = vi.fn()
  const {getByText} = renderWithTheme(
    <ResetConfirmDialog open={true} onClose={onClose} onConfirm={onConfirm} />,
  )

  fireEvent.click(getByText('prayer.cancel'))

  expect(onClose).toHaveBeenCalledTimes(1)
  expect(onConfirm).not.toHaveBeenCalled()
})
