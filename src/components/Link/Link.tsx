import * as React from 'react'
import {FunctionComponent} from 'react'
import {Link as MUILink} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Link as RouterLink} from 'react-router-dom'

const useStyles = makeStyles({
  home: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

interface LinkProps {
  to: string
}

export const Link: FunctionComponent<LinkProps> = ({to, children}) => {
  const classes = useStyles()
  return (
    <MUILink
      component={RouterLink}
      to={to}
      color="inherit"
      className={classes.home}
    >
      {children}
    </MUILink>
  )
}

export default Link
