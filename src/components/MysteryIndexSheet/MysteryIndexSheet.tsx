import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup} from 'src/utils/rosaryGroups'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (m: MysteryTypes) => void
}

const GROUPS: Array<{group: MysteryGroup; mysteries: MysteryTypes[]}> = [
  {
    group: MysteryGroup.Joyful,
    mysteries: [
      MysteryTypes.Joyful1,
      MysteryTypes.Joyful2,
      MysteryTypes.Joyful3,
      MysteryTypes.Joyful4,
      MysteryTypes.Joyful5,
    ],
  },
  {
    group: MysteryGroup.Luminous,
    mysteries: [
      MysteryTypes.Luminous1,
      MysteryTypes.Luminous2,
      MysteryTypes.Luminous3,
      MysteryTypes.Luminous4,
      MysteryTypes.Luminous5,
    ],
  },
  {
    group: MysteryGroup.Sorrowful,
    mysteries: [
      MysteryTypes.Sorrowful1,
      MysteryTypes.Sorrowful2,
      MysteryTypes.Sorrowful3,
      MysteryTypes.Sorrowful4,
      MysteryTypes.Sorrowful5,
    ],
  },
  {
    group: MysteryGroup.Glorious,
    mysteries: [
      MysteryTypes.Glorious1,
      MysteryTypes.Glorious2,
      MysteryTypes.Glorious3,
      MysteryTypes.Glorious4,
      MysteryTypes.Glorious5,
    ],
  },
]

export const MysteryIndexSheet = ({open, onClose, onSelect}: Props) => {
  const {t} = useTranslation()

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <List>
        {GROUPS.map(({group, mysteries}) => (
          <li key={group}>
            <ul>
              <ListSubheader>{t(`mysteries.groupTitle.${group}`)}</ListSubheader>
              {mysteries.map((type) => (
                <ListItemButton
                  key={type}
                  data-testid="index-mystery"
                  onClick={() => {
                    onSelect(type)
                    onClose()
                  }}
                >
                  <ListItemText primary={getMystery(type, t).title} />
                </ListItemButton>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Drawer>
  )
}
