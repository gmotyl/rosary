import React, {useState} from 'react'

import {Card, Typography, LinearProgress} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import {makeStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Container from '@material-ui/core/Container'

import {usePostUser} from 'src/hooks/useRosaryApi/usePostUser'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flexGrow: 1,
  },
}))

export const RegisterCard = () => {
  const classes = useStyles()
  const [paswordMismatch, setPasswordMismatch] = useState(false)
  const {postUser, isLoading, error, success} = usePostUser()

  // TODO: #30 move handleSubmit from LoginCard to container
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {email, password, password2} = e.target['elements']
    const paswordMismatch =
      password.value !== password2.value || !password.value
    setPasswordMismatch(paswordMismatch)

    if (!isLoading && !paswordMismatch) {
      postUser({email: email.value, password: password.value})
    }
  }

  const passwordHelperText = paswordMismatch ? 'hasła się różnią' : ''

  return (
    <>
      <Card className={classes.card}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AccountCircle />
            </Avatar>
            <Typography component="h1" variant="subtitle1">
              Nie masz konta ?
            </Typography>
            <Typography component="h1" variant="h5">
              Rejestracja:
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                error={paswordMismatch}
                helperText={passwordHelperText}
                onChange={() => setPasswordMismatch(false)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="Nowe hasło"
              />
              <TextField
                error={paswordMismatch}
                helperText={passwordHelperText}
                onChange={() => setPasswordMismatch(false)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Powtórz hasło"
                type="password"
                id="password2"
                autoComplete="Powtórz hasło"
              />
              {success ? (
                <MuiAlert elevation={6} variant="filled" severity="success">
                  "Dziękujemy! Teraz możesz się juz zalogować."
                </MuiAlert>
              ) : null}
              {error ? (
                <MuiAlert elevation={6} variant="filled" severity="error">
                  {error}
                </MuiAlert>
              ) : null}
              {isLoading ? (
                <LinearProgress
                  variant="query"
                  data-testid="progressbar"
                  className={classes.submit}
                />
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Zarejestruj
                </Button>
              )}
            </form>
          </div>
        </Container>
      </Card>
    </>
  )
}
