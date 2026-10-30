import {useState} from 'react'
import {makeStyles} from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PolicyIcon from '@mui/icons-material/Policy'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AddIcon from '@mui/icons-material/Add'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import ListItemText from '@mui/material/ListItemText'
import {useTranslation} from 'react-i18next'
import {useLocation} from 'react-router-dom'

import Link from '../Link'
import {FishIcon, RosaryIcon} from '../Icons'
import {AddRoseDialog} from '../AddRoseDialog'
import {LanguageSwitcher} from '../LanguageSwitcher'
import {HapticsSwitch} from '../HapticsSwitch'
import {isHapticsSupported} from 'src/tools/haptics'
import {navigation, NavLinkItem} from 'src/app/config/navigation'
import {useColorMode} from 'src/app/ColorModeContext'
import {ERoutes} from 'src/app/config/routes'
import {useRoses} from 'src/hooks'
import {toLocalDate} from 'src/utils/roseChangeDay'

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  addRose: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
    },
  },
}))

// "Różaniec" replaces the plain home entry; the rest of the navigation
// (About, Policy) stays below the rose block
const otherNavigation = navigation.filter((item) => item.path !== ERoutes.HOME)

interface SideMenuProps {
  setOpen: (state: boolean) => void
}

export const SideMenu: React.FC<SideMenuProps> = ({setOpen}) => {
  const classes = useStyles()
  const {t} = useTranslation()
  const {mode, toggle} = useColorMode()
  const {pathname} = useLocation()
  const {roses} = useRoses()
  const [addOpen, setAddOpen] = useState(false)
  const today = toLocalDate(new Date())
  const close = () => setOpen(false)

  return (
    <div className={classes.list} role="presentation">
      {/* Not closed on every click: "Dodaj różę" keeps the drawer open under its dialog */}
      <List data-testid="rose-menu">
        <Link to={ERoutes.HOME}>
          <ListItem button selected={pathname === ERoutes.HOME} onClick={close}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t('rose.menu.rosary')} />
          </ListItem>
        </Link>
        <Divider />
        {roses.map((rose) => (
          <Link key={rose.id} to={`/rose/${rose.id}/pray`}>
            <ListItem
              button
              selected={pathname.startsWith(`/rose/${rose.id}/`)}
              onClick={close}
            >
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>
              <ListItemText primary={rose.name} />
              {rose.prayedDays.includes(today) && (
                <FishIcon filled label={t('rose.menu.prayedToday')} />
              )}
            </ListItem>
          </Link>
        ))}
        <ListItem
          button
          className={classes.addRose}
          onClick={() => setAddOpen(true)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={t('rose.menu.add')} />
        </ListItem>
      </List>
      <AddRoseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={close}
      />
      <Divider />
      <List onClick={close} onKeyDown={close}>
        {otherNavigation.map((item) => (
          <NavListItem key={item.key} item={item} />
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggle} data-testid="dark-mode-toggle">
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText primary={t('menu.darkMode')} />
          <Switch edge="end" checked={mode === 'dark'} tabIndex={-1} />
        </ListItem>
        <ListItem>
          <LanguageSwitcher />
        </ListItem>
        {/* No row at all on devices that cannot vibrate (e.g. iOS) */}
        {isHapticsSupported() && (
          <ListItem>
            <HapticsSwitch />
          </ListItem>
        )}
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
