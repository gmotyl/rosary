import CssBaseline from '@mui/material/CssBaseline'
import {Theme} from '@mui/material/styles'
import {ThemeProvider} from '@mui/styles'
import {FC, PropsWithChildren} from 'react'
import {theme} from './App'

declare module '@mui/styles/defaultTheme' {
  // Module augmentation must use an (empty) interface to merge with DefaultTheme.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const StylesProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  )
}
