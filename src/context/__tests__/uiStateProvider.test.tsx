import React from 'react'
import {fireEvent} from '@testing-library/react'

import {
  UIStateProvider,
  UIContext,
  defaultValue,
  emptyPrayerData,
} from '../UIStateProvider'
import {mockGetObject, mockSetObject} from 'src/tools/repository'
import {entities} from 'src/consts/entities'
import {renderWithTheme} from 'src/tools/renderWithTheme'

jest.mock('src/tools/repository')

let value = {
  loginRedirect: '',
}

const expected = {
  loginRedirect: '/123/aa/bb',
}

const testPrayerData = {...emptyPrayerData, prayer: 'test'}

const TestComponent = () => {
  const {loginRedirect, setLoginRedirect, activePrayer} =
    React.useContext(UIContext)

  const updateContex = () => {
    setLoginRedirect(expected.loginRedirect)
  }

  const updatePrayerContex = () => {
    activePrayer.setActivePrayerData(testPrayerData)
  }

  React.useEffect(() => {
    value.loginRedirect = loginRedirect
  }, [loginRedirect])

  return (
    <>
      ala ma kota
      <div data-testid="button" onClick={updateContex}>
        test
      </div>
      <div data-testid="test-prayer-button" onClick={updatePrayerContex}>
        test2
      </div>
    </>
  )
}

const Wrapper = (
  <UIStateProvider>
    <TestComponent />
  </UIStateProvider>
)

it('should change value', () => {
  const {getByTestId} = renderWithTheme(Wrapper)

  expect(value.loginRedirect).toEqual(defaultValue.loginRedirect)

  fireEvent.click(getByTestId('button'))

  expect(value.loginRedirect).toEqual(expected.loginRedirect)
})

it('should use repository for prayer', () => {
  const {getByTestId} = renderWithTheme(Wrapper)
  mockGetObject.mockImplementation(() => jest.fn())
  expect(mockGetObject).toBeCalled()
  expect(mockGetObject).toBeCalledWith(entities.PRAYER, emptyPrayerData)

  fireEvent.click(getByTestId('test-prayer-button'))

  expect(mockSetObject).toBeCalled()
  expect(mockSetObject).toBeCalledWith(entities.PRAYER, testPrayerData)
})
