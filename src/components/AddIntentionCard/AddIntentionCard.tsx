import React, {FC, SyntheticEvent} from 'react'
import {
  Card,
  Container,
  CssBaseline,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@mui/material'
import {RosaryIcon} from '../Icons'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

interface AddIntentionCardProps {
  onSubmit: (e: SyntheticEvent) => void
}
export const AddIntentionCard: FC<AddIntentionCardProps> = ({onSubmit}) => {
  const classes = useStyles()
  return (
    <>
      <Card className={classes.card} data-testid="add-intention-card">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <RosaryIcon avatar />
            <Typography component="h1" variant="h5">
              Dodaj intencję
            </Typography>
            <form className={classes.form} onSubmit={onSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                multiline
                rows={2}
                required
                fullWidth
                id="title"
                label="Moja intencja"
                name="intention"
                autoComplete=""
                placeholder="Intencja, w której będziemy się modlić"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                multiline
                rows={6}
                fullWidth
                id="description"
                label="Opis (opcjonalnie)"
                name="description"
                autoComplete=""
                placeholder="Tutaj możesz dodać bardziej rozbudowany opis"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Wyślij
              </Button>
            </form>
          </div>
        </Container>
      </Card>
    </>
  )
}
