import {CircularProgress, Grid} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import {makeStyles} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import {Mystery} from 'src/consts/rosary'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flexGrow: 1,
  },
  bigAvatar: {
    margin: 10,
    width: 200,
    height: 200,
  },
}))

interface PrayCardProps {
  getPrayerButtonDisabled: boolean
  savePrayerButtonDisabled: boolean
  isLoading?: boolean
  mystery: Mystery
  onPrayRequestAction: () => void
  onPrayAction: () => void
}

export const PrayCard: React.ComponentType<PrayCardProps> = (props) => {
  const {getPrayerButtonDisabled, savePrayerButtonDisabled, mystery} = props

  const classes = useStyles()
  const actions = (
    <CardActions>
      <Button
        size="small"
        color="primary"
        onClick={props.onPrayRequestAction}
        disabled={getPrayerButtonDisabled}
        data-testid="pray-get-button"
      >
        Pobierz tajemnicę
      </Button>
      <Button
        size="small"
        color="primary"
        onClick={props.onPrayAction}
        disabled={savePrayerButtonDisabled}
        data-testid="pray-save-button"
      >
        Gotowe (zapisz)
      </Button>
    </CardActions>
  )

  return (
    <Card className={classes.card}>
      <Grid container={true} justify="center" alignItems="center">
        {props.isLoading ? (
          <CircularProgress size={42} />
        ) : (
          <Avatar alt="..." src={mystery.image} className={classes.bigAvatar} />
        )}
      </Grid>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom={true} variant="h5" component="h2">
          {getPrayerButtonDisabled ? mystery.title : null}
        </Typography>
        <Typography>
          {getPrayerButtonDisabled ? mystery.description : null}
        </Typography>
      </CardContent>
      {actions}
    </Card>
  )
}
