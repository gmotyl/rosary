import {makeStyles} from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PolicyIcon from '@mui/icons-material/Policy'
import ListItemText from '@mui/material/ListItemText'
import {useTranslation} from 'react-i18next'

import Link from '../Link'
import {RosaryIcon} from '../Icons'
import {LanguageSwitcher} from '../LanguageSwitcher'
import {navigation, NavLinkItem} from 'src/app/config/navigation'

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
}))

interface SideMenuProps {
  setOpen: (state: boolean) => void
}

export const SideMenu: React.FC<SideMenuProps> = ({setOpen}) => {
  const classes = useStyles()

  return (
    <div className={classes.list} role="presentation">
      <List
        onClick={() => setOpen(false)}
        onKeyDown={() => setOpen(false)}
      >
        {navigation.map((item) => (
          <NavListItem key={item.key} item={item} />
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <LanguageSwitcher />
        </ListItem>
      </List>
    </div>
  )
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'HomeIcon':
      return <HomeIcon />
    case 'RosaryIcon':
      return <RosaryIcon />
    case 'InfoIcon':
      return <InfoIcon />
    case 'PolicyIcon':
      return <PolicyIcon />
    default:
      return <HomeIcon />
  }
}

interface NavListItemProps {
  item: NavLinkItem
}

const NavListItem: React.FC<NavListItemProps> = ({item}) => {
  const {t} = useTranslation()
  return (
    <Link to={item.path}>
      <ListItem button>
        <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
        <ListItemText primary={t(item.labelKey)} />
      </ListItem>
    </Link>
  )
}
