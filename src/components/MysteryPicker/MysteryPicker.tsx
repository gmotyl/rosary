import {Box, FormLabel} from '@mui/material'
import {useId} from 'react'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {DecadeDots} from 'src/components/DecadeDots'
import {RosaryHeader} from 'src/components/RosaryHeader'
import {firstMysteryOfGroup} from 'src/utils/rosaryGroups'

export interface MysteryPickerProps {
  label: string
  value: MysteryTypes
  onChange: (mystery: MysteryTypes) => void
}

// Controlled two-step mystery picker built from the normal rosary's own
// controls: the RosaryHeader part menu, then the DecadeDots for the mystery.
// Picking a part jumps to its first mystery, as jumpToGroup does in PrayCard.
export const MysteryPicker = ({label, value, onChange}: MysteryPickerProps) => {
  const {t} = useTranslation()
  const labelId = useId()

  return (
    <Box role="group" aria-labelledby={labelId}>
      <FormLabel id={labelId} component="div" sx={{fontSize: 12}}>
        {label}
      </FormLabel>
      <RosaryHeader
        currentMystery={value}
        mysteryTitle={getMystery(value, t).title}
        onJumpToGroup={(group) => onChange(firstMysteryOfGroup(group))}
      />
      <DecadeDots currentMystery={value} onJumpToMystery={onChange} />
    </Box>
  )
}
