import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {RosaryLoop} from '../RosaryLoop'

const baseProps = {
  imageSrc: '/img/1.jpg',
  currentMystery: MysteryTypes.Joyful1,
  onAdvance: vi.fn(),
  onRetreat: vi.fn(),
}

describe('RosaryLoop', () => {
  it('renders 11 beads (1 OF + 10 HM)', () => {
    const {getAllByTestId} = render(<RosaryLoop {...baseProps} currentBead={0} />)
    expect(getAllByTestId(/^bead-\d+$/)).toHaveLength(11)
  })

  it('marks the OF bead (index 0) as active when currentBead = 0', () => {
    const {getByTestId} = render(<RosaryLoop {...baseProps} currentBead={0} />)
    expect(getByTestId('bead-0')).toHaveAttribute('data-state', 'active')
    expect(getByTestId('bead-0')).toHaveAttribute('data-bead-kind', 'of')
  })

  it('marks past/active/future correctly when currentBead = 4', () => {
    const {getByTestId} = render(<RosaryLoop {...baseProps} currentBead={4} />)
    expect(getByTestId('bead-0')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('bead-3')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('bead-4')).toHaveAttribute('data-state', 'active')
    expect(getByTestId('bead-5')).toHaveAttribute('data-state', 'future')
    expect(getByTestId('bead-10')).toHaveAttribute('data-state', 'future')
  })

  it('clicking the next-adjacent bead calls onAdvance', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={3} />,
    )
    fireEvent.click(getByTestId('bead-4').querySelector('button')!)
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('clicking the previous-adjacent bead calls onRetreat', () => {
    const onRetreat = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onRetreat={onRetreat} currentBead={3} />,
    )
    fireEvent.click(getByTestId('bead-2').querySelector('button')!)
    expect(onRetreat).toHaveBeenCalledTimes(1)
  })

  it('non-adjacent beads are not clickable', () => {
    const onAdvance = vi.fn()
    const onRetreat = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop
        {...baseProps}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
        currentBead={3}
      />,
    )
    fireEvent.click(getByTestId('bead-7').querySelector('button')!)
    fireEvent.click(getByTestId('bead-0').querySelector('button')!)
    expect(onAdvance).not.toHaveBeenCalled()
    expect(onRetreat).not.toHaveBeenCalled()
  })

  it('clicking the active bead is a no-op', () => {
    const onAdvance = vi.fn()
    const onRetreat = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop
        {...baseProps}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
        currentBead={5}
      />,
    )
    fireEvent.click(getByTestId('bead-5').querySelector('button')!)
    expect(onAdvance).not.toHaveBeenCalled()
    expect(onRetreat).not.toHaveBeenCalled()
  })

  it('clicking the central image calls onAdvance', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    fireEvent.click(getByTestId('rosary-image'))
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('at currentBead = 0 only bead-1 is the next-clickable (no prev)', () => {
    const onAdvance = vi.fn()
    const onRetreat = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop
        {...baseProps}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
        currentBead={0}
      />,
    )
    fireEvent.click(getByTestId('bead-1').querySelector('button')!)
    expect(onAdvance).toHaveBeenCalledTimes(1)
    expect(onRetreat).not.toHaveBeenCalled()
  })

  it('at currentBead = 10 only bead-9 is the prev-clickable (no next within decade)', () => {
    const onAdvance = vi.fn()
    const onRetreat = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop
        {...baseProps}
        onAdvance={onAdvance}
        onRetreat={onRetreat}
        currentBead={10}
      />,
    )
    fireEvent.click(getByTestId('bead-9').querySelector('button')!)
    expect(onRetreat).toHaveBeenCalledTimes(1)
    expect(onAdvance).not.toHaveBeenCalled()
  })
})
