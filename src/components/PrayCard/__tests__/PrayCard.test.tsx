import {vi, describe, it, expect} from 'vitest'
import {render, fireEvent} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {PrayCard} from '../PrayCard'

// vi.hoisted runs before imports — cannot reference imported enums here.
// MysteryTypes.Luminous3 = 10, MysteryTypes.Complete = 23 (raw numeric values).
const mocks = vi.hoisted(() => ({
  intention: {
    id: 'test',
    title: 'My intention',
    description: 'desc',
    currentMystery: 10 as number,
    currentBead: 4,
    decadesPrayed: 0,
    completedRosaries: 7,
  },
  tapBead: vi.fn(),
  jumpToMystery: vi.fn(),
  jumpToGroup: vi.fn(),
  restart: vi.fn(),
  prayNext: vi.fn(),
  prayPrev: vi.fn(),
}))

vi.mock('src/hooks', () => ({
  useIntentions: () => ({
    getIntention: () => mocks.intention,
    tapBead: mocks.tapBead,
    jumpToMystery: mocks.jumpToMystery,
    jumpToGroup: mocks.jumpToGroup,
    restart: mocks.restart,
    prayNext: mocks.prayNext,
    prayPrev: mocks.prayPrev,
  }),
}))

const renderInRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe('PrayCard', () => {
  it('renders the header, decade dots, the rosary loop, and Next button', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId, getByText} = renderInRouter(<PrayCard id="test" />)
    expect(getByTestId('rosary-header')).toBeTruthy()
    expect(getByTestId('decade-dots')).toBeTruthy()
    expect(getByTestId('rosary-loop')).toBeTruthy()
    expect(getByText(/prayer\.next/)).toBeTruthy()
  })

  it('Next button calls prayNext', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByText} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByText(/prayer\.next/))
    expect(mocks.prayNext).toHaveBeenCalledWith(mocks.intention)
  })

  it('tapping the next-adjacent bead calls prayNext (advance)', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    mocks.intention.currentBead = 4
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    // currentBead = 4, so bead-5 is the next-adjacent
    fireEvent.click(getByTestId('bead-5').querySelector('button')!)
    expect(mocks.prayNext).toHaveBeenCalledWith(mocks.intention)
  })

  it('tapping the previous-adjacent bead calls prayPrev (retreat)', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    mocks.intention.currentBead = 4
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByTestId('bead-3').querySelector('button')!)
    expect(mocks.prayPrev).toHaveBeenCalledWith(mocks.intention)
  })

  it('tapping a decade dot calls jumpToMystery for that decade in the current group', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByTestId('decade-dot-1'))
    expect(mocks.jumpToMystery).toHaveBeenCalledWith(
      mocks.intention,
      MysteryTypes.Luminous1,
    )
  })

  it('opens the group menu and jumps to a group on selection', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByTestId('rosary-header-trigger'))
    fireEvent.click(getByTestId('group-menu-glorious'))
    expect(mocks.jumpToGroup).toHaveBeenCalled()
  })

  it('shows Restart instead of Next at Complete sentinel and dispatches restart()', () => {
    mocks.intention.currentMystery = MysteryTypes.Complete
    const {getByText, queryByText} = renderInRouter(<PrayCard id="test" />)
    expect(queryByText(/prayer\.next/)).toBeNull()
    fireEvent.click(getByText(/prayer\.restart/))
    expect(mocks.restart).toHaveBeenCalledWith(mocks.intention)
  })

  it('renders completed rosary count when > 0', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    mocks.intention.completedRosaries = 7
    const {getByText} = renderInRouter(<PrayCard id="test" />)
    expect(getByText(/7/)).toBeTruthy()
  })
})
