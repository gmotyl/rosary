import {fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import {AddIntentionPage} from '../AddIntentionPage'
import {renderWithTheme} from 'src/tools/renderWithTheme'

const mockRequest = jest.fn()

jest.mock('../../../hooks/useRosaryApi', () => ({
  usePostIntention: () => ({
    isLoading: false,
    postIntention: mockRequest,
  }),
}))

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

    // fill out the form
    fireEvent.change(screen.getByLabelText(/intencja/i), {
      target: {value: 'chuck'},
    })
    fireEvent.change(screen.getByLabelText(/opis/i), {
      target: {value: 'norris'},
    })

    await fireEvent.submit(container.querySelector('form'))

    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      title: 'chuck',
      description: 'norris',
    })
  })
})
