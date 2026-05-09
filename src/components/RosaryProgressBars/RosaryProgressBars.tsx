import {Box, ButtonBase} from '@mui/material'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {
  MysteryGroup,
  bitForMystery,
  decadeIndex,
  firstMysteryOfGroup,
  groupOf,
} from 'src/utils/rosaryGroups'

interface RosaryProgressBarsProps {
  currentMystery: MysteryTypes
  decadesPrayed: number
  onJumpToGroup: (group: MysteryGroup) => void
  onJumpToMystery: (mystery: MysteryTypes) => void
}

const GROUPS: MysteryGroup[] = [
  MysteryGroup.Joyful,
  MysteryGroup.Luminous,
  MysteryGroup.Sorrowful,
  MysteryGroup.Glorious,
]

export const RosaryProgressBars: React.FC<RosaryProgressBarsProps> = ({
  currentMystery,
  decadesPrayed,
  onJumpToGroup,
  onJumpToMystery,
}) => {
  const currentGroup = groupOf(currentMystery)
  const currentDecade = decadeIndex(currentMystery)

  return (
    <Box sx={{my: 1}}>
      <Box data-testid="group-bar" sx={{display: 'flex', gap: 0.5, mb: 0.5}}>
        {GROUPS.map((g) => (
          <ButtonBase
            key={g}
            data-testid={`group-${g}`}
            onClick={() => onJumpToGroup(g)}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.main',
              backgroundColor:
                g === currentGroup ? 'primary.main' : 'transparent',
            }}
          />
        ))}
      </Box>
      <Box data-testid="decade-bar" sx={{display: 'flex', gap: 0.5}}>
        {[1, 2, 3, 4, 5].map((idx) => {
          const mystery = (firstMysteryOfGroup(currentGroup) + idx - 1) as MysteryTypes
          const prayed = (decadesPrayed & bitForMystery(mystery)) !== 0
          const isCurrent = idx === currentDecade
          return (
            <ButtonBase
              key={idx}
              data-testid={`decade-${idx}`}
              data-prayed={prayed ? 'true' : 'false'}
              onClick={() => onJumpToMystery(mystery)}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.main',
                backgroundColor:
                  isCurrent || prayed ? 'primary.main' : 'transparent',
                opacity: prayed && !isCurrent ? 0.6 : 1,
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}
