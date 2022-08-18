import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {makeStyles} from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Link from '../Link'

const useStyles = makeStyles((theme) => ({
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
}))

export const Hero = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <main>
        <span className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom={true}
            >
              Pomódl się za mnie
            </Typography>
            <Box fontStyle="italic" color="textPrimary">
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph={true}
              >
                "O cokolwiek przez różaniec prosić będziesz - otrzymasz."
              </Typography>
            </Box>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph={true}
            >
              Nasza internetowa wspólnota modli się w Twojej intencji.
            </Typography>
            <span className={classes.heroButtons}>
              <Grid container={true} spacing={2} justify="center">
                <Grid item={true}>
                  <Link to={`/add-intention`}>
                    <Button
                      variant="contained"
                      color="primary"
                      data-testid="add-intention"
                    >
                      Dodaj intencję
                    </Button>
                  </Link>
                </Grid>
                <Grid item={true}>
                  <Link to={`/how-it-works`}>
                    <Button
                      variant="outlined"
                      color="primary"
                      data-testid="how-it-works"
                    >
                      Jak to działa?
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </span>
          </Container>
        </span>
      </main>
    </React.Fragment>
  )
}

export default Hero
