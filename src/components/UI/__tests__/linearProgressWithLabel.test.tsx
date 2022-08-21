import React from 'react'
import {renderWithTheme} from 'src/tools/renderWithTheme'
import {LinearProgressWithLabel} from '../LinearProgressWithLabel'

it('should render label', () => {
  const label = '1.0.2'
  const {getByText} = renderWithTheme(<LinearProgressWithLabel label={label} />)

  expect(getByText(label)).toBeTruthy()
})
