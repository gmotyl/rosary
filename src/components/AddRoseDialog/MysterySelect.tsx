import TextField from '@mui/material/TextField'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup} from 'src/utils/rosaryGroups'

// The 20 mysteries in prayer order, five per part
const MYSTERY_GROUPS = [
  MysteryGroup.Joyful,
  MysteryGroup.Luminous,
  MysteryGroup.Sorrowful,
  MysteryGroup.Glorious,
].map((group, g) => ({
  group,
  mysteries: [1, 2, 3, 4, 5].map((i) => (g * 5 + i) as MysteryTypes),
}))

export interface MysterySelectProps {
  id: string
  label: string
  value: MysteryTypes
  onChange: (mystery: MysteryTypes) => void
}

// Native select of the 20 mysteries grouped by part.
// Shared by AddRoseDialog and the rose's Zmień tab.
export const MysterySelect = ({
  id,
  label,
  value,
  onChange,
}: MysterySelectProps) => {
  const {t} = useTranslation()

  return (
    <TextField
      select
      fullWidth
      id={id}
      label={label}
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value) as MysteryTypes)}
      SelectProps={{native: true}}
    >
      {MYSTERY_GROUPS.map(({group, mysteries}) => (
        <optgroup key={group} label={t(`mysteries.groupTitle.${group}`)}>
          {mysteries.map((type) => (
            <option key={type} value={String(type)}>
              {getMystery(type, t).title}
            </option>
          ))}
        </optgroup>
      ))}
    </TextField>
  )
}
