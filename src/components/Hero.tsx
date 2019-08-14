import * as React from "react";

import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
}));

const Hero = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <main>
        <div className={classes.heroContent}>
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
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph={true}
            >
              <Box fontStyle="italic" color="textPrimary">
                "O cokolwiek przez różaniec prosić będziesz - otrzymasz."
              </Box>
              Nasza internetowa wspólnota modli się w Twojej intencji.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container={true} spacing={2} justify="center">
                <Grid item={true}>
                  <Button variant="contained" color="primary">
                    Dodaj intencję
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button variant="outlined" color="primary">
                    Jak to działa?
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Hero;