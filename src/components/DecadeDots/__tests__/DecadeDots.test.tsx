import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {DecadeDots} from '../DecadeDots'

describe('DecadeDots', () => {
  it('renders five dots', () => {
    const {getAllByTestId} = render(
      <DecadeDots currentMystery={MysteryTypes.Joyful1} onJumpToMystery={vi.fn()} />,
    )
    expect(getAllByTestId(/^decade-dot-\d$/)).toHaveLength(5)
  })

  it('marks past/active/future for currentMystery = Joyful3', () => {
    const {getByTestId} = render(
      <DecadeDots currentMystery={MysteryTypes.Joyful3} onJumpToMystery={vi.fn()} />,
    )
    expect(getByTestId('decade-dot-1')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('decade-dot-2')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('decade-dot-3')).toHaveAttribute('data-state', 'active')
    expect(getByTestId('decade-dot-4')).toHaveAttribute('data-state', 'future')
    expect(getByTestId('decade-dot-5')).toHaveAttribute('data-state', 'future')
  })

  it('marks dots correctly for Sorrowful2 (decade 2 of Sorrowful group)', () => {
    const {getByTestId} = render(
      <DecadeDots currentMystery={MysteryTypes.Sorrowful2} onJumpToMystery={vi.fn()} />,
    )
    expect(getByTestId('decade-dot-1')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('decade-dot-2')).toHaveAttribute('data-state', 'active')
    expect(getByTestId('decade-dot-3')).toHaveAttribute('data-state', 'future')
  })

  it('clicking decade-dot-N jumps to the Nth mystery of the current group', () => {
    const onJumpToMystery = vi.fn()
    const {getByTestId} = render(
      <DecadeDots
        currentMystery={MysteryTypes.Glorious1}
        onJumpToMystery={onJumpToMystery}
      />,
    )
    fireEvent.click(getByTestId('decade-dot-4'))
    expect(onJumpToMystery).toHaveBeenCalledWith(MysteryTypes.Glorious4)
  })
})
