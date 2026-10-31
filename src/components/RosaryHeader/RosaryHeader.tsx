import {Box, Menu, MenuItem, Typography} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import {useRef, useState} from 'react'
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
  const groupTitle = t(`mysteries.groupTitle.${currentGroup}`)

  const open = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)
  // A Box with role="button" gets no native key activation, so add it the way
  // a native button does: Enter on keydown, Space on keyup. Opening on Space
  // keydown would move focus into the menu, and MUI's MenuItem (a non-native
  // ButtonBase) treats the Space keyup it then receives as a click — picking
  // the current group without the user choosing it.
  const spaceDownOnTrigger = useRef(false)
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setAnchor(e.currentTarget)
    } else if (e.key === ' ') {
      // Keep the page from scrolling and the advance-key hook from acting
      e.preventDefault()
      spaceDownOnTrigger.current = true
    }
  }
  const onTriggerKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== ' ' || !spaceDownOnTrigger.current) return
    spaceDownOnTrigger.current = false
    e.preventDefault()
    setAnchor(e.currentTarget)
  }
  const close = () => setAnchor(null)
  const select = (group: MysteryGroup) => {
    close()
    onJumpToGroup(group)
  }

  return (
    <Box sx={{textAlign: 'center', pt: 1, pb: 2}} data-testid="rosary-header">
      <Box
        role="button"
        // Lead with the visible part so the name says what is selected
        aria-label={`${groupTitle} – ${t('prayer.changeGroup')}`}
        aria-haspopup="menu"
        tabIndex={0}
        // Keep a pointer press from focusing the trigger: the menu restores
        // focus to whatever was focused when it opened, and a focused trigger
        // would swallow the next Space/Enter meant to advance the prayer.
        // Tab still reaches it for keyboard users.
        onMouseDown={(e) => e.preventDefault()}
        onClick={open}
        onKeyDown={onTriggerKeyDown}
        onKeyUp={onTriggerKeyUp}
        // A Space released elsewhere must not open the menu later
        onBlur={() => {
          spaceDownOnTrigger.current = false
        }}
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
          {groupTitle}
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
