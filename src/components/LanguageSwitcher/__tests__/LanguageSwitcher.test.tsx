import {render, fireEvent, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'

// LanguageSwitcher is the one component that needs the real i18n —
// override the global useTranslation mock from setupTests.ts.
vi.mock('react-i18next', async (importOriginal) =>
  await importOriginal<typeof import('react-i18next')>(),
)

import i18n from 'src/i18n'
import {LanguageSwitcher} from '../LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('renders all 6 supported languages in the dropdown', () => {
    render(<LanguageSwitcher />)
    fireEvent.mouseDown(screen.getByRole('combobox'))
    expect(screen.getAllByRole('option').length).toBe(6)
  })

  it('changes language and persists to localStorage', async () => {
    render(<LanguageSwitcher />)
    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(await screen.findByText('Polski'))

    expect(i18n.language).toBe('pl')
    expect(localStorage.getItem('rosary-language')).toBe('pl')
  })
})
