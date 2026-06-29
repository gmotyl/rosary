import {useMemo} from 'react'
import {CssBaseline} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {useLocalStorage} from 'react-use'
import Layout from '../containers/Layout'
import {createAppTheme, ColorMode} from './theme'
import {ColorModeContext} from './ColorModeContext'

// Default light theme kept as a named export for StylesProvider / test helpers.
export const theme = createAppTheme('light')

const App = () => {
  const [mode, setMode] = useLocalStorage<ColorMode>('rosary-color-mode', 'light')
  const activeMode: ColorMode = mode === 'dark' ? 'dark' : 'light'
  const appTheme = useMemo(() => createAppTheme(activeMode), [activeMode])
  const colorMode = useMemo(
    () => ({
      mode: activeMode,
      toggle: () => setMode(activeMode === 'dark' ? 'light' : 'dark'),
    }),
    [activeMode, setMode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Layout />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
