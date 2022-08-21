import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import AddIcon from '@mui/icons-material/Add'
import {Link} from 'react-router-dom'
import {ERoutes} from 'src/app/config/routes'
import {makeStyles} from '@mui/styles'
import { useState } from 'react'

const useStyles = makeStyles({
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
})

const Footer = () => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels
      className={classes.stickToBottom}
    >
      <BottomNavigationAction icon={<HomeIcon />} component={Link} to="/" />
      <BottomNavigationAction
        icon={<AddIcon />}
        component={Link}
        to={ERoutes.ADD_INTENTION}
      />
      <BottomNavigationAction
        icon={<InfoIcon />}
        component={Link}
        to={ERoutes.ABOUT}
      />
    </BottomNavigation>
  )
}

export default Footer
