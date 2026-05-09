import {makeStyles} from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PolicyIcon from '@mui/icons-material/Policy'
import ListItemText from '@mui/material/ListItemText'

import Link from '../Link'
import {RosaryIcon} from '../Icons'
import {navigation, navLabels, NavLinkItem} from 'src/app/config/navigation'

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
    <div
      className={classes.list}
      role="presentation"
      onClick={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
    >
      <List>{navigation.map(renderLink)}</List>
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

const renderLink = (item: NavLinkItem) => (
  <div key={item.key}>
    <Link to={item.path}>
      <ListItem button>
        <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
        <ListItemText primary={navLabels['pl'][item.key]} />
      </ListItem>
    </Link>
  </div>
)
