import {Breadcrumbs, Link as MuiLink, Typography} from '@mui/material'
import {Link as RouterLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {MysteryTypes} from 'src/consts/MysteryTypes'
import {groupOf, decadeIndex, MysteryGroup} from 'src/utils/rosaryGroups'

interface RosaryBreadcrumbProps {
  currentMystery: MysteryTypes
  onJumpToGroup: (group: MysteryGroup) => void
}

export const RosaryBreadcrumb: React.FC<RosaryBreadcrumbProps> = ({
  currentMystery,
  onJumpToGroup,
}) => {
  const {t} = useTranslation()
  const group = groupOf(currentMystery)
  const decade = decadeIndex(currentMystery)

  return (
    <Breadcrumbs aria-label="rosary navigation" sx={{mb: 1}}>
      <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
        {t('prayer.breadcrumb.home')}
      </MuiLink>
      <MuiLink
        component="button"
        underline="hover"
        color="inherit"
        onClick={() => onJumpToGroup(group)}
      >
        {t(`mysteries.groupName.${group}`)}
      </MuiLink>
      <Typography color="text.primary">
        {t('prayer.breadcrumb.mystery', {n: decade})}
      </Typography>
    </Breadcrumbs>
  )
}
