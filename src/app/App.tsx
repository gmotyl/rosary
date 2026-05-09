import {CssBaseline} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import Layout from '../containers/Layout'

export const theme = createTheme({
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
        <Layout />
      </ThemeProvider>
    </div>
  )
}

export default App
