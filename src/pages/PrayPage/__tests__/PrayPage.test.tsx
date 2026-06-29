import {fireEvent, screen, waitFor} from '@testing-library/react'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import {PrayPage} from '../PrayPage'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const mockRestart = vi.fn()
const mockJumpToMystery = vi.fn()
const mockGetIntention = vi.fn(() => ({
  id: 'default',
  title: 'For my family',
  description: '',
  currentMystery: MysteryTypes.Luminous2,
  currentBead: 3,
  decadesPrayed: 0,
}))

vi.mock('../../../hooks', () => ({
  useIntentions: () => ({
    getIntention: mockGetIntention,
    restart: mockRestart,
    jumpToMystery: mockJumpToMystery,
    jumpToGroup: vi.fn(),
    prayNext: vi.fn(),
    prayPrev: vi.fn(),
    tapBead: vi.fn(),
    saveIntention: vi.fn(),
    deleteIntention: vi.fn(),
  }),
}))

describe('PrayPage', () => {
  it('renders PrayCard for the default intention', () => {
    const {container} = renderWithTheme(<PrayPage />)
    expect(container).toBeTruthy()
    expect(mockGetIntention).toHaveBeenCalledWith('default')
  })

  it('clicking reset-tab opens ResetConfirmDialog', () => {
    renderWithTheme(<PrayPage />)

    fireEvent.click(screen.getByTestId('reset-tab'))

    expect(screen.getByText('prayer.resetTitle')).toBeInTheDocument()
  })

  it('confirming reset calls restart with the default intention and closes dialog', async () => {
    renderWithTheme(<PrayPage />)

    fireEvent.click(screen.getByTestId('reset-tab'))
    fireEvent.click(screen.getByText('prayer.resetConfirm'))

    expect(mockRestart).toHaveBeenCalledTimes(1)
    expect(mockRestart).toHaveBeenCalledWith(
      expect.objectContaining({id: 'default'}),
    )

    // Dialog uses keepMounted so the title node stays in DOM; check it's hidden
    await waitFor(() => {
      const title = screen.getByText('prayer.resetTitle')
      expect(title).not.toBeVisible()
    })
  })

  it('clicking index-tab opens MysteryIndexSheet with 20 mysteries', async () => {
    renderWithTheme(<PrayPage />)

    fireEvent.click(screen.getByTestId('index-tab'))

    await waitFor(() => {
      expect(screen.getAllByTestId('index-mystery')).toHaveLength(20)
    })
  })

  it('selecting a mystery from the index calls jumpToMystery', async () => {
    renderWithTheme(<PrayPage />)

    fireEvent.click(screen.getByTestId('index-tab'))

    await waitFor(() => {
      expect(screen.getAllByTestId('index-mystery')).toHaveLength(20)
    })

    fireEvent.click(screen.getAllByTestId('index-mystery')[0])

    expect(mockJumpToMystery).toHaveBeenCalledTimes(1)
    expect(mockJumpToMystery).toHaveBeenCalledWith(
      expect.objectContaining({id: 'default'}),
      MysteryTypes.Joyful1,
    )
  })
})
