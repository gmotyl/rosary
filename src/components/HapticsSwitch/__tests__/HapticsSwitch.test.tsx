import {render, fireEvent, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

// Use the real i18n so the label assertion checks the translated string
vi.mock(
  'react-i18next',
  async (importOriginal) =>
    await importOriginal<typeof import('react-i18next')>(),
)

import i18n from 'src/i18n'
import en from 'src/i18n/locales/en.json'
import pl from 'src/i18n/locales/pl.json'
import de from 'src/i18n/locales/de.json'
import es from 'src/i18n/locales/es.json'
import fr from 'src/i18n/locales/fr.json'
import it_ from 'src/i18n/locales/it.json'
import {HAPTICS_STORAGE_KEY} from 'src/tools/haptics'
import {HapticsSwitch} from '../HapticsSwitch'

// jsdom has no navigator.vibrate; install a configurable stub per test
const stubVibrate = () =>
  Object.defineProperty(navigator, 'vibrate', {
    configurable: true,
    writable: true,
    value: vi.fn(() => true),
  })

describe('HapticsSwitch', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    delete (navigator as unknown as {vibrate?: unknown}).vibrate
    localStorage.clear()
  })

  it('hidden without vibration support', () => {
    const {container} = render(<HapticsSwitch />)
    expect(container).toBeEmptyDOMElement()
  })

  it('checked by default with localized label', () => {
    stubVibrate()
    render(<HapticsSwitch />)
    expect(screen.getByRole('checkbox', {name: 'Vibration'})).toBeChecked()
  })

  it('toggling off persists across remount', () => {
    stubVibrate()
    const {unmount} = render(<HapticsSwitch />)
    fireEvent.click(screen.getByRole('checkbox', {name: 'Vibration'}))
    expect(localStorage.getItem(HAPTICS_STORAGE_KEY)).toBe('false')
    unmount()

    render(<HapticsSwitch />)
    expect(screen.getByRole('checkbox', {name: 'Vibration'})).not.toBeChecked()
  })

  it('every locale defines hapticsSwitch.label', () => {
    const expected: Array<[string, unknown, string]> = [
      ['en', en, 'Vibration'],
      ['pl', pl, 'Wibracja'],
      ['de', de, 'Vibration'],
      ['es', es, 'Vibración'],
      ['fr', fr, 'Vibration'],
      ['it', it_, 'Vibrazione'],
    ]
    for (const [lng, locale, label] of expected) {
      const value = (locale as {hapticsSwitch?: {label?: string}}).hapticsSwitch
        ?.label
      expect(value, lng).toBe(label)
    }
  })
})
