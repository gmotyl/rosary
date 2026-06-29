import {fireEvent} from '@testing-library/react'
import {vi} from 'vitest'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {MysteryIndexSheet} from '../index'

it('renders 20 mystery rows when open', () => {
  const {getAllByTestId} = renderWithTheme(
    <MysteryIndexSheet open={true} onClose={vi.fn()} onSelect={vi.fn()} />,
  )

  expect(getAllByTestId('index-mystery')).toHaveLength(20)
})

it('clicking 7th row (Luminous1) calls onSelect and onClose', () => {
  const onSelect = vi.fn()
  const onClose = vi.fn()
  const {getAllByTestId} = renderWithTheme(
    <MysteryIndexSheet open={true} onClose={onClose} onSelect={onSelect} />,
  )

  fireEvent.click(getAllByTestId('index-mystery')[5]) // index 5 = Luminous1 (Joyful1-5 occupy 0-4)

  expect(onSelect).toHaveBeenCalledWith(MysteryTypes.Luminous1)
  expect(onClose).toHaveBeenCalledTimes(1)
})
