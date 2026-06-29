import {createTheme, Theme} from '@mui/material/styles'

export type ColorMode = 'light' | 'dark'

const serif = 'Georgia,"Times New Roman",serif'

const palettes = {
  light: {
    primary: {main: '#6B1438'}, // liturgical claret
    secondary: {main: '#C39A4E'}, // gilt gold
    background: {default: '#F7F3EC', paper: '#FBF8F2'}, // parchment
    text: {primary: '#2A2320', secondary: '#6B6058'},
    divider: '#E2D8C6',
  },
  dark: {
    primary: {main: '#D98BA6'}, // lightened claret for contrast on dark
    secondary: {main: '#E7CF9B'}, // lightened gilt gold
    background: {default: '#1A1419', paper: '#241C22'}, // deep aubergine-charcoal
    text: {primary: '#F3ECDD', secondary: '#B8AEA0'},
    divider: '#3A3340',
  },
}

export const createAppTheme = (mode: ColorMode): Theme =>
  createTheme({
    palette: {mode, ...palettes[mode]},
    typography: {
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      h4: {fontFamily: serif, fontWeight: 600},
      h5: {fontFamily: serif, fontWeight: 600},
      h6: {fontFamily: serif, fontWeight: 700, letterSpacing: '0.18em'},
    },
    shape: {borderRadius: 12},
  })
