import {fireEvent} from '@testing-library/react'
import {AddIntentionCard} from '../AddIntentionCard'
import {renderWithTheme} from 'src/tools/renderWithTheme'

describe('AddInentionCard', () => {
  it('should render textbox', () => {
    const {getAllByRole} = renderWithTheme(
      <AddIntentionCard onSubmit={jest.fn} />,
    )

    expect(getAllByRole('textbox')).toBeTruthy()
  })
  it('should render tatle and description and send button', () => {
    const {getByPlaceholderText, getByRole} = renderWithTheme(
      <AddIntentionCard onSubmit={jest.fn()} />,
    )

    expect(getByPlaceholderText(/intencja/i)).toBeTruthy()
    expect(getByPlaceholderText(/opis/i)).toBeTruthy()
    expect(getByRole('button')).toBeTruthy()
  })
  it('should call onSubmit action', () => {
    const submitSpy = jest.fn()
    const {container} = renderWithTheme(
      <AddIntentionCard onSubmit={submitSpy} />,
    )

    const form = container.querySelector('form')
    fireEvent.submit(form as HTMLFormElement)

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
