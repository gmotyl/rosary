import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup} from 'src/utils/rosaryGroups'
import {RosaryHeader} from '../RosaryHeader'

describe('RosaryHeader', () => {
  it('renders the group title key', () => {
    const {getByText} = render(
      <RosaryHeader
        currentMystery={MysteryTypes.Joyful3}
        mysteryTitle="3rd Joyful Mystery: The Nativity"
        onJumpToGroup={vi.fn()}
      />,
    )
    expect(getByText('mysteries.groupTitle.joyful')).toBeTruthy()
  })

  it('strips the part before the colon for the subtitle', () => {
    const {getByTestId} = render(
      <RosaryHeader
        currentMystery={MysteryTypes.Sorrowful3}
        mysteryTitle="3rd Sorrowful Mystery: The Crowning with Thorns"
        onJumpToGroup={vi.fn()}
      />,
    )
    expect(getByTestId('rosary-header-subtitle').textContent).toBe(
      'The Crowning with Thorns',
    )
  })

  it('falls back to the full title when no colon is present', () => {
    const {getByTestId} = render(
      <RosaryHeader
        currentMystery={MysteryTypes.Joyful1}
        mysteryTitle="No-colon title"
        onJumpToGroup={vi.fn()}
      />,
    )
    expect(getByTestId('rosary-header-subtitle').textContent).toBe('No-colon title')
  })

  it('opens the menu and lists all four groups', () => {
    const {getByTestId} = render(
      <RosaryHeader
        currentMystery={MysteryTypes.Joyful1}
        mysteryTitle="t"
        onJumpToGroup={vi.fn()}
      />,
    )
    fireEvent.click(getByTestId('rosary-header-trigger'))
    expect(getByTestId('group-menu-joyful')).toBeTruthy()
    expect(getByTestId('group-menu-sorrowful')).toBeTruthy()
    expect(getByTestId('group-menu-glorious')).toBeTruthy()
    expect(getByTestId('group-menu-luminous')).toBeTruthy()
  })

  it('clicking a menu item calls onJumpToGroup with that group', () => {
    const onJumpToGroup = vi.fn()
    const {getByTestId} = render(
      <RosaryHeader
        currentMystery={MysteryTypes.Joyful1}
        mysteryTitle="t"
        onJumpToGroup={onJumpToGroup}
      />,
    )
    fireEvent.click(getByTestId('rosary-header-trigger'))
    fireEvent.click(getByTestId('group-menu-sorrowful'))
    expect(onJumpToGroup).toHaveBeenCalledWith(MysteryGroup.Sorrowful)
  })
})
