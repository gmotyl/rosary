import CssBaseline from '@mui/material/CssBaseline'
import {createTheme, Theme} from '@mui/material/styles'
import {ThemeProvider} from '@mui/styles'
import {FC, PropsWithChildren} from 'react'

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#880e4f',
    },
    secondary: {
      main: '#fb8c00',
    },
  },
})

export const StylesProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <>
      {/* <CssBaseline /> */}
      {/* <StyledEngineProvider injectFirst> */}
      <>
        <CssBaseline />
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </>
      {/* </StyledEngineProvider> */}
    </>
  )
}
