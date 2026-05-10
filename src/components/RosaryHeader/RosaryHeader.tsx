import {Box, Menu, MenuItem, Typography} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup, groupOf} from 'src/utils/rosaryGroups'

const ALL_GROUPS: MysteryGroup[] = [
  MysteryGroup.Joyful,
  MysteryGroup.Sorrowful,
  MysteryGroup.Glorious,
  MysteryGroup.Luminous,
]

// Mystery i18n titles follow the pattern "<ordinal> <Group> Mystery: <Name>".
// Strip everything up to and including the first ": " so the subtitle shows just the name.
const mysteryNameOnly = (title: string): string => {
  const idx = title.indexOf(': ')
  return idx >= 0 ? title.slice(idx + 2) : title
}

interface RosaryHeaderProps {
  currentMystery: MysteryTypes
  mysteryTitle: string
  onJumpToGroup: (group: MysteryGroup) => void
}

export const RosaryHeader: React.FC<RosaryHeaderProps> = ({
  currentMystery,
  mysteryTitle,
  onJumpToGroup,
}) => {
  const {t} = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const currentGroup = groupOf(currentMystery)

  const open = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)
  const close = () => setAnchor(null)
  const select = (group: MysteryGroup) => {
    close()
    onJumpToGroup(group)
  }

  return (
    <Box sx={{textAlign: 'center', pt: 1, pb: 2}} data-testid="rosary-header">
      <Box
        role="button"
        aria-label={t('prayer.changeGroup')}
        aria-haspopup="menu"
        onClick={open}
        data-testid="rosary-header-trigger"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          px: 2,
          py: 0.75,
          borderRadius: 2,
          minHeight: 44,
          transition: 'background-color 150ms',
          '&:hover': {backgroundColor: 'action.hover'},
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{color: 'primary.main', fontWeight: 600, lineHeight: 1.2}}
        >
          {t(`mysteries.groupTitle.${currentGroup}`)}
        </Typography>
        <ExpandMoreIcon sx={{color: 'primary.main'}} />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{display: 'block', mt: 0.5, px: 2}}
        data-testid="rosary-header-subtitle"
      >
        {mysteryNameOnly(mysteryTitle)}
      </Typography>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        {ALL_GROUPS.map((g) => (
          <MenuItem
            key={g}
            selected={g === currentGroup}
            onClick={() => select(g)}
            data-testid={`group-menu-${g}`}
            sx={{minWidth: 200, gap: 1}}
          >
            <Box sx={{width: 24, display: 'inline-flex', justifyContent: 'center'}}>
              {g === currentGroup ? <CheckIcon fontSize="small" /> : null}
            </Box>
            {t(`mysteries.groupTitle.${g}`)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
