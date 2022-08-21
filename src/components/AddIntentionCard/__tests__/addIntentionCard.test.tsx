import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import {AddIntentionCard} from '../AddIntentionCard'

describe('AddInentionCard', () => {
  it('should render textbox', () => {
    const {getAllByRole} = render(<AddIntentionCard onSubmit={jest.fn} />)

    expect(getAllByRole('textbox')).toBeTruthy()
  })
  it('should render tatle and description and send button', () => {
    const {getByPlaceholderText, getByRole} = render(
      <AddIntentionCard onSubmit={jest.fn()} />,
    )

    expect(getByPlaceholderText(/intencja/i)).toBeTruthy()
    expect(getByPlaceholderText(/opis/i)).toBeTruthy()
    expect(getByRole('button')).toBeTruthy()
  })
  it('should call onSubmit action', () => {
    const submitSpy = jest.fn()
    const {container} = render(<AddIntentionCard onSubmit={submitSpy} />)

    const form = container.querySelector('form')
    fireEvent.submit(form as HTMLFormElement)

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
