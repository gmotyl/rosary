import {CssBaseline} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import Layout from '../containers/Layout'

export const theme = createTheme({
  palette: {
    primary: {main: '#6B1438'},      // liturgical claret
    secondary: {main: '#C39A4E'},    // gilt gold
    background: {default: '#F7F3EC', paper: '#FBF8F2'}, // parchment
    text: {primary: '#2A2320', secondary: '#6B6058'},
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    h4: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 600},
    h5: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 600},
    h6: {fontFamily: 'Georgia,"Times New Roman",serif', fontWeight: 700, letterSpacing: '0.18em'},
  },
  shape: {borderRadius: 12},
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
