import {act, fireEvent, render, screen} from '@testing-library/react'
import {vi} from 'vitest'
import '@testing-library/jest-dom'

import i18n from 'src/i18n'
import {StylesProvider} from 'src/app/StylesProvider'
import {FishCelebration} from '..'

// Celebration strings are asserted in Polish, so use the real i18n instance
vi.unmock('react-i18next')

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const mockMatchMedia = (reduced: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query === REDUCED_MOTION,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const renderCelebration = (onClose = vi.fn()) => {
  render(
    <StylesProvider>
      <FishCelebration
        open
        prayed={23}
        daysInMonth={31}
        monthLabel="październiku"
        onClose={onClose}
      />
    </StylesProvider>,
  )
  return onClose
}

describe('FishCelebration', () => {
  const originalMatchMedia = window.matchMedia

  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  beforeEach(() => {
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = originalMatchMedia
  })

  it('shows fish, praise text and month counter', () => {
    renderCelebration()

    const overlay = screen.getByTestId('fish-celebration')
    expect(overlay.querySelector('svg')).toBeInTheDocument()
    expect(
      screen.getByText('Chwała Panu! Dziesiątka odmówiona.'),
    ).toBeInTheDocument()
    expect(screen.getByText('23 z 31 dni w październiku')).toBeInTheDocument()
    // Slide-in and pulses are on when motion is allowed
    expect(screen.getByTestId('fish-celebration-fish')).toHaveAttribute(
      'data-animated',
      'true',
    )
  })

  it('tap closes immediately', () => {
    vi.useFakeTimers()
    const onClose = renderCelebration()

    fireEvent.click(screen.getByTestId('fish-celebration'))
    expect(onClose).toHaveBeenCalledTimes(1)

    // The pending auto-hide must not fire a second close
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('key press closes immediately', () => {
    const onClose = renderCelebration()

    fireEvent.keyDown(window, {key: 'Enter'})
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(window, {key: ' '})
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('auto-hides after about 5 seconds', () => {
    vi.useFakeTimers()
    const onClose = renderCelebration()

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalledTimes(1)

    // A tap during or after the fade does not close twice
    fireEvent.click(screen.getByTestId('fish-celebration'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('no slide or pulse under reduced motion', () => {
    mockMatchMedia(true)
    renderCelebration()

    const fish = screen.getByTestId('fish-celebration-fish')
    expect(fish).toHaveAttribute('data-animated', 'false')
    expect(fish.style.animation).toBe('')
    expect(getComputedStyle(fish).animationName || 'none').toMatch(/^(none|)$/)
  })
})
