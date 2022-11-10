import {render} from '@testing-library/react'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {PrayCard} from '../PrayCard'
import hooksMock from 'src/hooks'

jest.mock('src/hooks', () => {
  let currentMystery = 2
  let prayMock = jest.fn()
  return {
    useIntentions: () =>
      ({
        getIntention: jest.fn(() => ({
          currentMystery: currentMystery,
          name: 'test',
          id: 'test',
        })),
        pray: prayMock,
      } as any),
    setMockMystery: (mystery: MysteryTypes) => (currentMystery = mystery),
    prayMock,
  }
})

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
    hooksMock.setMockMystery(MysteryTypes.Complete)

    const {getByTestId} = render(<PrayCard id="1" />)
    expect(getByTestId('pray-reload-button')).toBeTruthy()
  })

  it('should reset Prayer on reload button click', () => {
    hooksMock.setMockMystery(MysteryTypes.Complete)

    const {getByTestId} = render(<PrayCard id="1" />)
    getByTestId('pray-reload-button').click()
    expect(hooksMock.prayMock).toHaveBeenCalled()
  })
})
