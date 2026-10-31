import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import {makeStyles} from '@mui/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import {useRouteMatch} from 'react-router-dom'

import DrawerMenu from 'src/components/DrawerMenu'
import Link from 'src/components/Link'
import {ERoutes} from 'src/app/config/routes'
import {useRoses} from 'src/hooks'

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
  // Header sits outside the route tree, so match the rose route explicitly
  const roseMatch = useRouteMatch<{id: string}>(ERoutes.ROSE)
  const {roses} = useRoses()
  const rose = roseMatch && roses.find((r) => r.id === roseMatch.params.id)
  const title = rose ? rose.name : 'ROSARY'
  return (
    <div className={classes.grow}>
      <HideOnScroll>
        <AppBar
          sx={{
            bgcolor: 'background.paper',
            color: 'primary.main',
            boxShadow: 'none',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <DrawerMenu></DrawerMenu>
            <div className={classes.grow} />
            {/* Flex items default to min-width: auto, which for nowrap text is
                the whole name; min-width 0 lets a long rose name shrink so
                the Typography ellipsis applies instead of overflowing */}
            <Box
              data-testid="header-title"
              sx={{minWidth: 0, overflow: 'hidden'}}
            >
              <Link to={'/'}>
                <Typography variant="h6" color="inherit" noWrap={true}>
                  {title}
                </Typography>
              </Link>
            </Box>
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Box className={classes.box} />
    </div>
  )
}

export default Header
