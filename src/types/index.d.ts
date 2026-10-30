import {Theme} from '@mui/material/styles'

declare module '@mui/styles/defaultTheme' {
  // Module augmentation must use an (empty) interface to merge with DefaultTheme.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
