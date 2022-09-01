import {CssBaseline} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import Layout from '../containers/Layout'
import AuthProvider from '../context/AuthProvider'
import {UIStateProvider} from '../context/UIStateProvider'

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

const App = () => {
  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <UIStateProvider>
            <Layout />
          </UIStateProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
