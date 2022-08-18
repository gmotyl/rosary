import React from 'react'
import {Typography, makeStyles} from '@mui/material'
import VerifiedUser from '@mui/icons-material/VerifiedUser'

import Link from '../Link'

interface ITopMenuProps {
  isAuthenticated?: boolean
}

const useStyles = makeStyles((theme) => ({
  icon: {
    float: 'right',
  },
}))

export const TopMenu: React.FunctionComponent<ITopMenuProps> = ({
  isAuthenticated,
}) => {
  const classes = useStyles()
  const userLink = isAuthenticated ? (
    <VerifiedUser data-testid="logged-user" className={classes.icon} />
  ) : (
    <Link to="/login">Login</Link>
  )
  return (
    <>
      <Typography variant="h6" color="inherit" noWrap={true}>
        {userLink}
      </Typography>
    </>
  )
}
