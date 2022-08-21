import {render} from '@testing-library/react'
import {StylesProvider} from 'src/app/StylesProvider'

export const renderWithTheme = (ui: any) => {
  const Wrapper = ({children}: any) => (
    <StylesProvider>{children}</StylesProvider>
  )
  return {
    ...render(ui, {wrapper: Wrapper}),
  }
}
