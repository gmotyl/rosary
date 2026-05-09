import {vi, describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {PrayCard} from '../PrayCard'

// vi.hoisted runs before imports — mutable state must live inside this call.
const mocks = vi.hoisted(() => ({
  currentMystery: 2 as MysteryTypes | number,
  prayMock: vi.fn(),
  completedRosaries: 7,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {language: 'en', changeLanguage: vi.fn()},
  }),
}))

vi.mock('src/hooks', () => ({
  useIntentions: () => ({
    getIntention: vi.fn(() => ({
      currentMystery: mocks.currentMystery,
      name: 'test',
      id: 'test',
      completedRosaries: mocks.completedRosaries,
    })),
    pray: mocks.prayMock,
  }),
}))

describe('PrayCard', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<PrayCard id="1" />)
    expect(baseElement).toBeTruthy()
  })

  it('should render next button', () => {
    const {getByTestId} = render(<PrayCard id="1" />)
    expect(getByTestId('pray-next-button')).toBeTruthy()
  })

  it('should render reload button', () => {
    mocks.currentMystery = MysteryTypes.Complete

    const {getByTestId} = render(<PrayCard id="1" />)
    expect(getByTestId('pray-reload-button')).toBeTruthy()
  })

  it('should reset Prayer on reload button click', () => {
    mocks.currentMystery = MysteryTypes.Complete

    const {getByTestId} = render(<PrayCard id="1" />)
    getByTestId('pray-reload-button').click()
    expect(mocks.prayMock).toHaveBeenCalled()
  })

  it('shows completed rosary count when > 0', () => {
    mocks.completedRosaries = 7
    mocks.currentMystery = 2

    const {getByText} = render(<PrayCard id="1" />)
    expect(getByText(/7/)).toBeTruthy()
  })
})
