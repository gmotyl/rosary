import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'

import {RosaryBreadcrumb} from '../RosaryBreadcrumb'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup} from 'src/utils/rosaryGroups'

const renderInRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe('RosaryBreadcrumb', () => {
  it('renders three segments: home, group, mystery', () => {
    const {getByText} = renderInRouter(
      <RosaryBreadcrumb
        currentMystery={MysteryTypes.Luminous3}
        onJumpToGroup={vi.fn()}
      />,
    )
    expect(getByText('prayer.breadcrumb.home')).toBeTruthy()
    expect(getByText('mysteries.groupName.luminous')).toBeTruthy()
    expect(getByText(/prayer\.breadcrumb\.mystery|3/)).toBeTruthy()
  })

  it('group segment click calls onJumpToGroup with the current group', () => {
    const onJump = vi.fn()
    const {getByText} = renderInRouter(
      <RosaryBreadcrumb
        currentMystery={MysteryTypes.Sorrowful2}
        onJumpToGroup={onJump}
      />,
    )
    fireEvent.click(getByText('mysteries.groupName.sorrowful'))
    expect(onJump).toHaveBeenCalledWith(MysteryGroup.Sorrowful)
  })
})
