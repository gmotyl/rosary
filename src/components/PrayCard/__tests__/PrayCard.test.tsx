import {render} from '@testing-library/react'
import {PrayCard} from '../PrayCard'

describe('PrayCard', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<PrayCard id="1" />)
    expect(baseElement).toBeTruthy()
  })

  it('should render next button', () => {
    const {getByTestId} = render(<PrayCard id="1" />)
    expect(getByTestId('pray-next-button')).toBeTruthy()
  })
})
