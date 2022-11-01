import {BrowserRouter} from 'react-router-dom'
import {Container} from '@mui/material'

import {AppRoutes} from 'src/containers/AppRoutes'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(6),
  },
}))

const Router = BrowserRouter as any

export const Layout = () => {
  const classes = useStyles()
  return (
    <>
      <Router>
        <Header />
        <Container className={classes.mainContainer} maxWidth="lg">
          <AppRoutes />
        </Container>
        <Footer />
      </Router>
    </>
  )
}

export default Layout
