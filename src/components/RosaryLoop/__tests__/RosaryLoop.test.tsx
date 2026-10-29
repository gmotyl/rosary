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

// jsdom's PointerEvent drops clientX/clientY, so dispatch a MouseEvent under the
// pointer event type (React's onPointerDown/onPointerUp still receive it) and
// assert it really carries its coordinates so the swipe tests cannot pass vacuously.
const pointer = (
  el: Element,
  type: 'pointerdown' | 'pointerup',
  clientX: number,
  clientY: number,
  isPrimary = true,
) => {
  const event = new MouseEvent(type, {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
  })
  // MouseEvent has no isPrimary; browsers set it on every pointer event
  Object.defineProperty(event, 'isPrimary', {value: isPrimary})
  expect(event.clientX).toBe(clientX)
  expect(event.clientY).toBe(clientY)
  fireEvent(el, event)
}

const drag = (start: Element, end: Element, dx: number, dy: number) => {
  pointer(start, 'pointerdown', 200, 100)
  pointer(end, 'pointerup', 200 + dx, 100 + dy)
}

describe('RosaryLoop', () => {
  it('renders 11 beads (1 OF + 10 HM)', () => {
    const {getAllByTestId} = render(
      <RosaryLoop {...baseProps} currentBead={0} />,
    )
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

  it('horizontal swipe left advances', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    drag(stage, stage, -80, 10)
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('short or vertical drags do not advance', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    drag(stage, stage, -30, 0)
    drag(stage, stage, -60, 60)
    drag(stage, stage, 80, 0)
    expect(onAdvance).not.toHaveBeenCalled()
  })

  it('swipe ending on a bead advances once', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    const nextBead = getByTestId('bead-3').querySelector('button')!
    drag(stage, nextBead, -80, 10)
    fireEvent.click(nextBead)
    expect(onAdvance).toHaveBeenCalledTimes(1)

    const image = getByTestId('rosary-image')
    drag(image, image, -80, 10)
    fireEvent.click(image)
    expect(onAdvance).toHaveBeenCalledTimes(2)
  })

  it('tap on next bead still advances once', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    const nextBead = getByTestId('bead-3').querySelector('button')!
    // A swipe with no trailing click must not swallow a later tap.
    drag(stage, stage, -80, 0)
    expect(onAdvance).toHaveBeenCalledTimes(1)
    drag(nextBead, nextBead, 0, 0)
    fireEvent.click(nextBead)
    expect(onAdvance).toHaveBeenCalledTimes(2)
  })

  it('swipe disabled does nothing', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop
        {...baseProps}
        onAdvance={onAdvance}
        currentBead={2}
        swipeEnabled={false}
      />,
    )
    const stage = getByTestId('rosary-loop')
    drag(stage, stage, -80, 10)
    expect(onAdvance).not.toHaveBeenCalled()
  })

  it('a second finger does not disturb the swipe', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    pointer(stage, 'pointerdown', 200, 100)
    // Secondary pointer must neither overwrite the start point nor end the gesture
    pointer(stage, 'pointerdown', 120, 100, false)
    pointer(stage, 'pointerup', 120, 100, false)
    expect(onAdvance).not.toHaveBeenCalled()
    pointer(stage, 'pointerup', 120, 100)
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('moved drags that are not swipes do not click through', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const image = getByTestId('rosary-image')
    // detail: 1 marks a pointer-generated click, as browsers report it
    drag(image, image, 0, 80) // vertical
    fireEvent.click(image, {detail: 1})
    drag(image, image, 80, 0) // rightward
    fireEvent.click(image, {detail: 1})
    drag(image, image, -30, 0) // too short
    fireEvent.click(image, {detail: 1})
    expect(onAdvance).not.toHaveBeenCalled()
  })

  it('a tap with tiny jitter still clicks', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const image = getByTestId('rosary-image')
    drag(image, image, 3, -3)
    fireEvent.click(image, {detail: 1})
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('mouse swipe released outside the stage still advances', () => {
    const onAdvance = vi.fn()
    const {getByTestId} = render(
      <RosaryLoop {...baseProps} onAdvance={onAdvance} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    // Mouse has no implicit pointer capture, so the release lands outside.
    pointer(stage, 'pointerdown', 200, 100)
    pointer(document.body, 'pointerup', 100, 100)
    expect(onAdvance).toHaveBeenCalledTimes(1)
    // The gesture is over: another stray release must not advance again.
    pointer(document.body, 'pointerup', 100, 100)
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })

  it('removes window gesture listeners on completion and unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const {getByTestId, unmount} = render(
      <RosaryLoop {...baseProps} currentBead={2} />,
    )
    const stage = getByTestId('rosary-loop')
    const added = () =>
      add.mock.calls.filter(([t]) => t === 'pointerup' || t === 'pointercancel')
    const removed = () =>
      remove.mock.calls.filter(
        ([t]) => t === 'pointerup' || t === 'pointercancel',
      )

    pointer(stage, 'pointerdown', 200, 100)
    expect(added()).toHaveLength(2)
    pointer(stage, 'pointerup', 200, 100)
    expect(removed()).toHaveLength(2)
    expect(removed().map(([, fn]) => fn)).toEqual(added().map(([, fn]) => fn))

    pointer(stage, 'pointerdown', 200, 100)
    expect(added()).toHaveLength(4)
    unmount()
    expect(removed()).toHaveLength(4)
    expect(removed().map(([, fn]) => fn)).toEqual(added().map(([, fn]) => fn))
    add.mockRestore()
    remove.mockRestore()
  })

  it('native image drag is prevented on the stage', () => {
    const {getByTestId} = render(<RosaryLoop {...baseProps} currentBead={2} />)
    // A native HTML5 drag would end the pointer gesture with pointercancel
    const notPrevented = fireEvent.dragStart(getByTestId('rosary-image'))
    expect(notPrevented).toBe(false)
  })

  it('stage allows vertical panning', () => {
    const {getByTestId} = render(<RosaryLoop {...baseProps} currentBead={2} />)
    // jsdom's CSS parser ignores touch-action, so read the inline style property.
    expect((getByTestId('rosary-loop') as HTMLElement).style.touchAction).toBe(
      'pan-y',
    )
  })
})
