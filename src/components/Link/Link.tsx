import {FunctionComponent} from 'react'
import {Link as MUILink} from '@mui/material'
import {Link as RouterLink} from 'react-router-dom'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles({
  home: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

interface LinkProps {
  to: string
  underline?: 'none' | 'always' | 'hover' | undefined
}

export const Link: FunctionComponent<React.PropsWithChildren<LinkProps>> = ({
  to,
  underline,
  children,
}) => {
  const classes = useStyles()
  return (
    <MUILink
      component={RouterLink}
      to={to}
      color="inherit"
      className={classes.home}
      underline={underline ?? 'none'}
    >
      {children}
    </MUILink>
  )
}

export default Link
