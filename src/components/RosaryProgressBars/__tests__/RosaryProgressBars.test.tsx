import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent, within} from '@testing-library/react'

import {RosaryProgressBars} from '../RosaryProgressBars'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup, bitForMystery} from 'src/utils/rosaryGroups'

describe('RosaryProgressBars', () => {
  it('renders 4 group segments and 5 decade segments', () => {
    const {getByTestId} = render(
      <RosaryProgressBars
        currentMystery={MysteryTypes.Luminous3}
        decadesPrayed={0}
        onJumpToGroup={vi.fn()}
        onJumpToMystery={vi.fn()}
      />,
    )
    const groupBar = getByTestId('group-bar')
    const decadeBar = getByTestId('decade-bar')
    expect(within(groupBar).getAllByRole('button')).toHaveLength(4)
    expect(within(decadeBar).getAllByRole('button')).toHaveLength(5)
  })

  it('group click dispatches onJumpToGroup with target group', () => {
    const onJumpToGroup = vi.fn()
    const {getByTestId} = render(
      <RosaryProgressBars
        currentMystery={MysteryTypes.Joyful1}
        decadesPrayed={0}
        onJumpToGroup={onJumpToGroup}
        onJumpToMystery={vi.fn()}
      />,
    )
    fireEvent.click(within(getByTestId('group-bar')).getByTestId('group-sorrowful'))
    expect(onJumpToGroup).toHaveBeenCalledWith(MysteryGroup.Sorrowful)
  })

  it('decade click dispatches onJumpToMystery for that decade in current group', () => {
    const onJumpToMystery = vi.fn()
    const {getByTestId} = render(
      <RosaryProgressBars
        currentMystery={MysteryTypes.Luminous3}
        decadesPrayed={0}
        onJumpToGroup={vi.fn()}
        onJumpToMystery={onJumpToMystery}
      />,
    )
    fireEvent.click(within(getByTestId('decade-bar')).getByTestId('decade-1'))
    expect(onJumpToMystery).toHaveBeenCalledWith(MysteryTypes.Luminous1)
  })

  it('decade segments mark previously-prayed bits with the prayed-flag', () => {
    const mask = bitForMystery(MysteryTypes.Luminous1) | bitForMystery(MysteryTypes.Luminous2)
    const {getByTestId} = render(
      <RosaryProgressBars
        currentMystery={MysteryTypes.Luminous3}
        decadesPrayed={mask}
        onJumpToGroup={vi.fn()}
        onJumpToMystery={vi.fn()}
      />,
    )
    expect(within(getByTestId('decade-bar')).getByTestId('decade-1')).toHaveAttribute('data-prayed', 'true')
    expect(within(getByTestId('decade-bar')).getByTestId('decade-2')).toHaveAttribute('data-prayed', 'true')
    expect(within(getByTestId('decade-bar')).getByTestId('decade-3')).toHaveAttribute('data-prayed', 'false')
  })
})
