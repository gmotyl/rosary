import React from 'react'
import {Prayer} from '../Prayer'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {UIContext, UIStateProvider} from 'src/context/UIStateProvider'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {getMystery} from 'src/consts/rosary'

const intention = {
  id: '2',
  userId: '3',
  title: 'title',
  description: 'desc',
}

jest.mock('src/hooks/useRosaryApi/usePrayRosaryRequest', () => ({
  usePrayRosaryRequest: () => ({
    type: 18, //MysteryTypes.Glorious3
    rosary: '2',
    prayer: '3',
    isPrayRequestLoading: false,
    doPrayRequest: jest.fn(),
  }),
}))

const Container = () => {
  const {activePrayer} = React.useContext(UIContext)
  const prayerId = '123456'
  return (
    <div>
      {activePrayer.isPraying ? (
        <Prayer prayerId={prayerId} intention={intention} />
      ) : null}
      <button
        data-testid="start-pray-context"
        onClick={() => {
          activePrayer.setIspraying(true)
          activePrayer.setActivePrayerData({
            prayer: prayerId,
            rosary: '999',
            type: MysteryTypes.Luminous1,
          })
          activePrayer.setPrayerStart(new Date())
        }}
      />
      <button
        data-testid="start-pray-other-context"
        onClick={() => {
          activePrayer.setIspraying(true)
          activePrayer.setActivePrayerData({
            prayer: '789',
            rosary: '999',
            type: MysteryTypes.Luminous1,
          })
          activePrayer.setPrayerStart(new Date())
        }}
      />
    </div>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Prayer', () => {
  it('should render', () => {
    const {container} = render(<Prayer prayerId="1" intention={intention} />)

    expect(container.innerHTML).toMatch('Pobierz tajemnicę')
    expect(container.innerHTML).toMatch('Gotowe')
  })

  it('should render save action button disabled', () => {
    const mystery = getMystery(MysteryTypes.Glorious3).title
    const {getByTestId, container} = render(
      <Prayer prayerId="1" intention={intention} />,
    )
    const getButton = getByTestId('pray-get-button')
    const saveButton = getByTestId('pray-save-button')

    expect(getButton).toBeEnabled()
    expect(saveButton).toBeDisabled()

    fireEvent.click(getButton)

    expect(getButton).toBeDisabled()
    expect(saveButton).toBeEnabled()
    expect(container.innerHTML).toContain(mystery)
  })

  it('should render prayer state from UI contex', () => {
    const mystery = getMystery(MysteryTypes.Luminous1).title
    const {getByTestId, container} = render(
      <UIStateProvider>
        <Container />
      </UIStateProvider>,
    )
    const contextButton = getByTestId('start-pray-context')

    fireEvent.click(contextButton)

    const getButton = getByTestId('pray-get-button')
    const saveButton = getByTestId('pray-save-button')

    expect(getButton).toBeDisabled()
    expect(saveButton).toBeEnabled()
    expect(container.innerHTML).toContain(mystery)
  })

  it('should not render prayer state from UI contex of diffrent prayer', () => {
    const {getByTestId} = render(
      <UIStateProvider>
        <Container />
      </UIStateProvider>,
    )
    const contextButton = getByTestId('start-pray-other-context')

    fireEvent.click(contextButton)

    const getButton = getByTestId('pray-get-button')
    const saveButton = getByTestId('pray-save-button')

    expect(getButton).toBeEnabled()
    expect(saveButton).toBeDisabled()
  })
})
