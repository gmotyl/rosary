import {FC, SVGProps} from 'react'
import {useTheme} from '@mui/material/styles'

// Ichthys outline: body plus tail, drawn on a 24×16 box (as in the mockup)
const FISH_PATH =
  'M23 8 C18 1 9.5 1.5 5.5 8 C9.5 14.5 18 15 23 8 Z M5.5 8 L1 3 L1 13 Z'

// Grey of an unprayed day (mockup --fish-off)
const FISH_OFF = '#B9AE9F'

export interface FishIconProps extends SVGProps<SVGSVGElement> {
  filled?: boolean
  // Accessible name; without it the fish is decorative
  label?: string
  width?: number
  height?: number
}

export const FishIcon: FC<FishIconProps> = ({
  filled = false,
  label,
  width = 20,
  height = 14,
  ...rest
}) => {
  const theme = useTheme()
  const color = filled ? theme.palette.primary.main : FISH_OFF

  return (
    <svg
      viewBox="0 0 24 16"
      width={width}
      height={height}
      data-filled={filled ? 'true' : 'false'}
      {...(label
        ? {role: 'img', 'aria-label': label}
        : {'aria-hidden': true, focusable: false})}
      {...rest}
    >
      <path
        d={FISH_PATH}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  )
}
