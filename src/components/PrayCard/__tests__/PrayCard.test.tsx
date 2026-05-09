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
}))

vi.mock('src/hooks', () => ({
  useIntentions: () => ({
    getIntention: () => mocks.intention,
    tapBead: mocks.tapBead,
    jumpToMystery: mocks.jumpToMystery,
    jumpToGroup: mocks.jumpToGroup,
    restart: mocks.restart,
    prayNext: mocks.prayNext,
  }),
}))

const renderInRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

describe('PrayCard', () => {
  it('renders the breadcrumb, progress bars, bead circle, and Next button', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId, getByText} = renderInRouter(<PrayCard id="test" />)
    expect(getByTestId('group-bar')).toBeTruthy()
    expect(getByTestId('decade-bar')).toBeTruthy()
    expect(getByTestId('bead-1')).toBeTruthy()
    expect(getByText(/prayer\.next/)).toBeTruthy()
  })

  it('Next button calls prayNext', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByText} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByText(/prayer\.next/))
    expect(mocks.prayNext).toHaveBeenCalledWith(mocks.intention)
  })

  it('tapping a bead calls tapBead with that bead number', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByTestId('bead-7'))
    expect(mocks.tapBead).toHaveBeenCalledWith(mocks.intention, 7)
  })

  it('tapping a decade bar calls jumpToMystery', () => {
    mocks.intention.currentMystery = MysteryTypes.Luminous3
    const {getByTestId} = renderInRouter(<PrayCard id="test" />)
    fireEvent.click(getByTestId('decade-1'))
    expect(mocks.jumpToMystery).toHaveBeenCalledWith(
      mocks.intention,
      MysteryTypes.Luminous1,
    )
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
