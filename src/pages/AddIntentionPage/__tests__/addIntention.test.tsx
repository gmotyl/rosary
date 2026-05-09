import {fireEvent, screen} from '@testing-library/react'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import {AddIntentionPage} from '../AddIntentionPage'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const mockSaveIntention = vi.fn()

vi.mock('../../../hooks', () => ({
  useIntentions: () => ({
    saveIntention: mockSaveIntention,
  }),
}))
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useHistory: () => ({goBack: vi.fn()}),
  }
})

describe('Add intention Page', () => {
  it('should render form', () => {
    const {container} = renderWithTheme(<AddIntentionPage />)

    expect(container).toBeTruthy()
  })

  it('should render add intention card', () => {
    const {getByTestId} = renderWithTheme(<AddIntentionPage />)

    expect(getByTestId('add-intention-card')).toBeTruthy()
  })

  it('should allow user to save intention', async () => {
    const {container} = renderWithTheme(<AddIntentionPage />)

    fireEvent.change(screen.getByLabelText(/intencja/i), {
      target: {value: 'chuck'},
    })
    fireEvent.change(screen.getByLabelText(/opis/i), {
      target: {value: 'norris'},
    })

    await fireEvent.submit(container.querySelector('form')!)

    expect(mockSaveIntention).toHaveBeenCalledTimes(1)
    expect(mockSaveIntention).toHaveBeenCalledWith({
      id: expect.any(String),
      title: 'chuck',
      description: 'norris',
      currentMystery: MysteryTypes.Joyful1,
    })
  })
})
