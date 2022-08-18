import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {makeStyles} from '@mui/material/styles'
import {Container} from '@mui/material'

import {AppRoutes} from 'src/containers/AppRoutes'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(6),
  },
}))

export const Layout = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Router>
        <Header />
        <Container className={classes.mainContainer} maxWidth="lg">
          <AppRoutes />
        </Container>
        <Footer />
      </Router>
    </React.Fragment>
  )
}

export default Layout
