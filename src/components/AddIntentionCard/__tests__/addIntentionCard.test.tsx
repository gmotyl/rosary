import {fireEvent} from '@testing-library/react'
import {vi} from 'vitest'

import {AddIntentionCard} from '../AddIntentionCard'
import {renderWithTheme} from 'src/tools/renderWithTheme'

describe('AddIntentionCard', () => {
  it('should render textbox', () => {
    const {getAllByRole} = renderWithTheme(
      <AddIntentionCard onSubmit={vi.fn()} />,
    )

    expect(getAllByRole('textbox')).toBeTruthy()
  })

  it('should render title and description fields plus a submit button', () => {
    const {getByPlaceholderText, getByRole} = renderWithTheme(
      <AddIntentionCard onSubmit={vi.fn()} />,
    )

    expect(getByPlaceholderText('intentionForm.titlePlaceholder')).toBeTruthy()
    expect(getByPlaceholderText('intentionForm.descriptionPlaceholder')).toBeTruthy()
    expect(getByRole('button')).toBeTruthy()
  })

  it('calls onSubmit when the form is submitted', () => {
    const submitSpy = vi.fn()
    const {container} = renderWithTheme(
      <AddIntentionCard onSubmit={submitSpy} />,
    )

    const form = container.querySelector('form')!
    fireEvent.submit(form)

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
