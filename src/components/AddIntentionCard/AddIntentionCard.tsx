import {FC, SyntheticEvent} from 'react'
import {
  Card,
  Container,
  CssBaseline,
  Typography,
  TextField,
  Button,
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

import {RosaryIcon} from '../Icons'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
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
  const {t} = useTranslation()
  return (
    <Card className={classes.card} data-testid="add-intention-card">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <RosaryIcon avatar />
          <Typography component="h1" variant="h5">
            {t('menu.addIntention')}
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
              label={t('intentionForm.title')}
              name="intention"
              autoComplete=""
              placeholder={t('intentionForm.titlePlaceholder')}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              rows={6}
              fullWidth
              id="description"
              label={t('intentionForm.description')}
              name="description"
              autoComplete=""
              placeholder={t('intentionForm.descriptionPlaceholder')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t('intentionForm.submit')}
            </Button>
          </form>
        </div>
      </Container>
    </Card>
  )
}
