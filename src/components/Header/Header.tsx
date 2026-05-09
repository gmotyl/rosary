import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import {makeStyles} from '@mui/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import DrawerMenu from 'src/components/DrawerMenu'
import Link from 'src/components/Link'
import {Badge} from '@mui/material'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  box: {
    paddingBottom: theme.spacing(5),
  },
  home: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}))

interface HideOnScrollProps {
  children: React.ReactElement
}
function HideOnScroll(props: HideOnScrollProps) {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  )
}

export const Header = () => {
  const classes = useStyles()
  const title = 'ROSARY'
  return (
    <div className={classes.grow}>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <DrawerMenu></DrawerMenu>
            <Link to={'/'}>
              <Badge color="secondary" badgeContent="beta">
                <Typography variant="h6" color="inherit" noWrap={true}>
                  {title}
                </Typography>
              </Badge>
            </Link>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Box className={classes.box} />
    </div>
  )
}

export default Header
