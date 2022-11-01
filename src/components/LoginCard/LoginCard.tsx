import {FC} from 'react'

import {Card, Typography} from '@mui/material'
import MuiAlert from '@mui/lab/Alert'
import {makeStyles} from '@mui/styles'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Container from '@mui/material/Container'
import {GoogleBtn} from './GoogleBtn'

import {ApiError} from 'src/services/api'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(3),
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

interface LoginCardProps {
  error: ApiError
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const LoginCard: FC<LoginCardProps> = ({handleSubmit, error}) => {
  const classes = useStyles()

  return (
    <>
      <Card className={classes.card}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <GoogleBtn />
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h6">
              lub przez e-mail:
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
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Zapamiętaj mnie"
              />
              {error.isError ? (
                <MuiAlert elevation={6} variant="filled" severity="error">
                  {error.code === 401
                    ? 'Nieprawidłowy login lub hasło.'
                    : error.message}
                </MuiAlert>
              ) : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Zaloguj
              </Button>

              {/* <Grid container> */}
              {/* <Grid item xs> */}
              {/* <Link href="#" variant="body2"> */}
              {/* Nie pamiętasz hasła? */}
              {/* </Link> */}
              {/* </Grid> */}
              {/* <Grid item> */}
              {/* <Link href="#" variant="body2"> */}
              {/* {'Nie masz konta? Rejestracja'} */}
              {/* </Link> */}
              {/* </Grid> */}
              {/* </Grid> */}
            </form>
          </div>
        </Container>
      </Card>
    </>
  )
}

export default LoginCard
