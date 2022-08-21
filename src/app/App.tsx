import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  adaptV4Theme,
  StyledEngineProvider,
  Theme,
} from '@mui/material/styles'
import {ThemeProvider} from '@mui/styles'
import Layout from '../containers/Layout'
import AuthProvider from '../context/AuthProvider'
import {UIStateProvider} from '../context/UIStateProvider'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: '#880e4f',
      },
      secondary: {
        main: '#fb8c00',
      },
    },
  }),
)

export type OrareTheme = typeof theme

const App = () => {
  return (
    <div>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <UIStateProvider>
              <Layout />
            </UIStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}

export default App
