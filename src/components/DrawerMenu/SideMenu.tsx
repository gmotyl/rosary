import React, {useContext} from 'react'
import {makeStyles} from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PolicyIcon from '@mui/icons-material/Policy'
import ListItemText from '@mui/material/ListItemText'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import Link from '../Link'
import {AuthContext} from 'src/context/AuthProvider'
import {RosaryIcon} from '../Icons'
import {
  navigationFactory,
  navLabels,
  NavLinkItem,
  isNavLinkItem,
  NavActionItem,
} from 'src/app/config/navigation'

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
}))

interface SideMenuProps {
  setOpen: (state: boolean) => void
}

// TODO: #29 map navItems array to SideMenu ListItems

export const SideMenu: React.FC<SideMenuProps> = ({setOpen}) => {
  const classes = useStyles()
  const {hasRole, logout} = useContext(AuthContext)
  const navigation = navigationFactory({logout})
  const menuItems = navigation
    .filter((n) => n.roles.some(hasRole))
    .map((n) => (isNavLinkItem(n) ? renderLink(n) : renderAction(n)))

  return (
    <div
      className={classes.list}
      role="presentation"
      onClick={(e) => setOpen(false)}
      onKeyDown={(e) => setOpen(false)}
    >
      {' '}
      <List>{menuItems}</List>
    </div>
  )
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'HomeIcon':
      return <HomeIcon />
    case 'RosaryIcon':
      return <RosaryIcon />
    case 'AccountCircleIcon':
      return <AccountCircleIcon />
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

const renderAction = (item: NavActionItem) => (
  <div key={item.key}>
    <ListItem button key={item.key} onClick={item.action}>
      <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
      <ListItemText primary={navLabels['pl'][item.key]} />
    </ListItem>
  </div>
)
