import CssBaseline from '@mui/material/CssBaseline'
import {createMuiTheme} from '@mui/material/styles'
import {ThemeProvider} from '@mui/styles'
import * as React from 'react'
import Layout from '../containers/Layout'
import AuthProvider from '../context/AuthProvider'
import {UIStateProvider} from '../context/UIStateProvider'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#880e4f',
    },
    secondary: {
      main: '#fb8c00',
    },
  },
})

export type OrareTheme = typeof theme

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
