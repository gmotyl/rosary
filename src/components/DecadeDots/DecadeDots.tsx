import {Box, ButtonBase} from '@mui/material'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {decadeIndex, firstMysteryOfGroup, groupOf} from 'src/utils/rosaryGroups'

const DOT_SIZE = 14
const ACTIVE_SCALE = 1.4
const HIT_SIZE = 44 // mobile-friendly tap target
const LINE_HEIGHT = 2
const LINE_MAX_WIDTH = 36

interface DecadeDotsProps {
  currentMystery: MysteryTypes
  onJumpToMystery: (mystery: MysteryTypes) => void
}

export const DecadeDots: React.FC<DecadeDotsProps> = ({
  currentMystery,
  onJumpToMystery,
}) => {
  const group = groupOf(currentMystery)
  const groupStart = firstMysteryOfGroup(group)
  const activeDecade = decadeIndex(currentMystery) // 1..5
  const decades = [1, 2, 3, 4, 5] as const

  return (
    <Box
      data-testid="decade-dots"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 1.5,
      }}
    >
      {decades.map((idx, i) => {
        const mystery = (groupStart + idx - 1) as MysteryTypes
        const state = idx < activeDecade ? 'past' : idx === activeDecade ? 'active' : 'future'
        return (
          <Box
            key={idx}
            sx={{display: 'flex', alignItems: 'center'}}
          >
            <ButtonBase
              data-testid={`decade-dot-${idx}`}
              data-state={state}
              onClick={() => onJumpToMystery(mystery)}
              focusRipple
              sx={{
                width: HIT_SIZE,
                height: HIT_SIZE,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  backgroundColor: state === 'future' ? 'background.paper' : 'primary.main',
                  transform: state === 'active' ? `scale(${ACTIVE_SCALE})` : 'scale(1)',
                  boxShadow: state === 'active' ? '0 0 0 4px rgba(136, 14, 79, 0.25)' : 'none',
                  transition: 'transform 200ms, box-shadow 200ms',
                }}
              />
            </ButtonBase>
            {i < decades.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  maxWidth: LINE_MAX_WIDTH,
                  height: LINE_HEIGHT,
                  backgroundColor: idx < activeDecade ? 'primary.main' : 'divider',
                  mx: 0.5,
                }}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
