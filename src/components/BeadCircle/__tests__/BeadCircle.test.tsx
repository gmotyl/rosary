import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent} from '@testing-library/react'

import {BeadCircle} from '../BeadCircle'

describe('BeadCircle', () => {
  it('renders 10 Hail Mary beads', () => {
    const {getAllByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={0} onTapBead={vi.fn()} />,
    )
    expect(getAllByTestId(/^bead-/)).toHaveLength(10)
  })

  it('renders the three marker chips', () => {
    const {getByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={0} onTapBead={vi.fn()} />,
    )
    expect(getByTestId('marker-our-father')).toBeTruthy()
    expect(getByTestId('marker-glory-be')).toBeTruthy()
    expect(getByTestId('marker-fatima')).toBeTruthy()
  })

  it('marks the bead at index currentBead+1 as active', () => {
    const {getByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={4} onTapBead={vi.fn()} />,
    )
    expect(getByTestId('bead-5')).toHaveAttribute('data-active', 'true')
    expect(getByTestId('bead-4')).toHaveAttribute('data-active', 'false')
  })

  it('marks beads 1..currentBead as past', () => {
    const {getByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={3} onTapBead={vi.fn()} />,
    )
    expect(getByTestId('bead-1')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('bead-3')).toHaveAttribute('data-state', 'past')
    expect(getByTestId('bead-4')).toHaveAttribute('data-state', 'active')
    expect(getByTestId('bead-5')).toHaveAttribute('data-state', 'future')
  })

  it('clicking bead N calls onTapBead(N)', () => {
    const onTapBead = vi.fn()
    const {getByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={0} onTapBead={onTapBead} />,
    )
    fireEvent.click(getByTestId('bead-7'))
    expect(onTapBead).toHaveBeenCalledWith(7)
  })

  it('marker chips do not call any handler when clicked', () => {
    const onTapBead = vi.fn()
    const {getByTestId} = render(
      <BeadCircle imageSrc="/img/1.jpg" currentBead={0} onTapBead={onTapBead} />,
    )
    fireEvent.click(getByTestId('marker-our-father'))
    fireEvent.click(getByTestId('marker-glory-be'))
    fireEvent.click(getByTestId('marker-fatima'))
    expect(onTapBead).not.toHaveBeenCalled()
  })
})
