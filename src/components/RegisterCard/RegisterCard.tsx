import React, {FC, useEffect, useState} from 'react'

import {Card, Typography, LinearProgress} from '@mui/material'
import MuiAlert from '@mui/lab/Alert'
import {makeStyles} from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Container from '@mui/material/Container'

import {ApiError} from 'src/services/api'

const useStyles = makeStyles((theme) => ({
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

interface RegisterCardProps {
  error: ApiError
  handleSubmit: (email: string, password: string) => void
  success: boolean
  isLoading: boolean
}

export const RegisterCard: FC<RegisterCardProps> = ({
  handleSubmit,
  error,
  success,
  isLoading,
}) => {
  const classes = useStyles()
  const [paswordMismatch, setPasswordMismatch] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError(false)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordMismatch(false)
  }
  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword2(e.target.value)
    setPasswordMismatch(false)
  }

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const paswordMismatch = password !== password2 || !password
    setPasswordMismatch(paswordMismatch)
    if (!paswordMismatch) {
      handleSubmit(email, password)
    }
  }

  useEffect(() => {
    setEmail('')
    setPassword('')
    setPassword2('')
  }, [success, setEmail, setPassword, setPassword2])

  useEffect(() => {
    setEmailError(error.isError && error.code === 400)
  }, [error, setEmailError])

  const passwordHelperText = paswordMismatch ? 'hasła się różnią' : ''
  const emailErrorText = emailError
    ? 'takie konto już istnieje lub adres jest nie prawidłowy'
    : ''

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
            <form
              className={classes.form}
              onSubmit={handleRegisterSubmit}
              data-testid="register-form"
            >
              <TextField
                error={emailError}
                helperText={emailErrorText}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
              />
              <TextField
                error={paswordMismatch}
                helperText={passwordHelperText}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="Nowe hasło"
                value={password}
                onChange={handlePasswordChange}
              />
              <TextField
                error={paswordMismatch}
                helperText={passwordHelperText}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Powtórz hasło"
                type="password"
                id="password2"
                autoComplete="Powtórz hasło"
                value={password2}
                onChange={handlePassword2Change}
              />
              {success ? (
                <MuiAlert elevation={6} variant="filled" severity="success">
                  "Dziękujemy! Teraz możesz się juz zalogować."
                </MuiAlert>
              ) : null}
              {error.isError ? (
                <MuiAlert elevation={6} variant="filled" severity="error">
                  {error.code === 400
                    ? 'Popraw dane formularza'
                    : error.message}
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
