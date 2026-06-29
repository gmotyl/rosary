import {createContext, useContext} from 'react'
import {ColorMode} from './theme'

export interface ColorModeContextValue {
  mode: ColorMode
  toggle: () => void
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggle: () => {},
})

export const useColorMode = () => useContext(ColorModeContext)
