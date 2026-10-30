import {FC, useCallback, useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import {alpha, keyframes} from '@mui/material/styles'

import {FishIcon} from 'src/components/Icons'
import {formatMonthCounter} from './monthLocative'

// Whole overlay lifetime; the fade runs over its last fifth (as in the mockup)
export const CELEBRATION_MS = 5000

// Mockup keyframes: fish swims in from the left, pulses twice, text rises,
// the overlay fades at the end
const swim = keyframes`
  from { transform: translateX(-260px); opacity: 0; }
  to { transform: none; opacity: 1; }
`
const pulse = keyframes`
  50% { transform: scale(1.12); }
`
const rise = keyframes`
  from { transform: translateY(12px); opacity: 0; }
  to { transform: none; opacity: 1; }
`
const fade = keyframes`
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
`

export interface FishCelebrationProps {
  open: boolean
  prayed: number
  daysInMonth: number
  // Month name already inflected by the caller, e.g. "październiku"
  monthLabel: string
  onClose: () => void
}

export const FishCelebration: FC<FishCelebrationProps> = ({
  open,
  prayed,
  daysInMonth,
  monthLabel,
  onClose,
}) => {
  const {t} = useTranslation()
  // noSsr reads the query on the first render, so no animation flashes in
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    noSsr: true,
  })
  const animated = !reducedMotion

  // Keep the latest onClose without restarting the timer on every render
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  // One close per showing: a tap during the fade must not close twice
  const closedRef = useRef(false)

  const close = useCallback(() => {
    if (closedRef.current) return
    closedRef.current = true
    onCloseRef.current()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    closedRef.current = false
    const timer = window.setTimeout(close, CELEBRATION_MS)
    const onKeyDown = () => close()
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (!open) return null

  return (
    <Box
      data-testid="fish-celebration"
      role="status"
      aria-live="polite"
      onClick={close}
      sx={(theme) => ({
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: alpha(theme.palette.background.default, 0.94),
        animation: `${fade} ${CELEBRATION_MS}ms ${
          animated ? 'ease' : 'step-end'
        } forwards`,
      })}
    >
      <Box>
        <Box
          data-testid="fish-celebration-fish"
          data-animated={animated ? 'true' : 'false'}
          sx={{
            display: 'inline-block',
            ...(animated && {
              animation: `${swim} .7s cubic-bezier(.2,.8,.2,1) both, ${pulse} 1s ease-in-out .7s 2`,
            }),
          }}
        >
          <FishIcon filled width={150} height={100} />
        </Box>
        <Box
          sx={{
            mt: 1.75,
            ...(animated && {animation: `${rise} .7s ease .2s both`}),
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: 22,
              lineHeight: 1.3,
              color: 'primary.main',
              whiteSpace: 'pre-line',
            }}
          >
            {t('rose.celebration.praise')}
          </Typography>
          <Typography sx={{fontSize: 14, color: 'text.secondary', mt: 0.75}}>
            {formatMonthCounter(prayed, daysInMonth, monthLabel, t)}
          </Typography>
        </Box>
        <Typography sx={{fontSize: 11, color: 'text.secondary', mt: 3.5}}>
          {t('rose.celebration.hint')}
        </Typography>
      </Box>
    </Box>
  )
}
