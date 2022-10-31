import {Grid} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import {makeStyles} from '@mui/styles'
import Typography from '@mui/material/Typography'

import {getMystery} from 'src/consts/rosary'
import {useIntentions} from 'src/hooks'
import {IIntention} from 'src/pages/IntentionPage/Interface'

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
  intention: IIntention
}

export const PrayCard: React.ComponentType<PrayCardProps> = ({intention}) => {
  const classes = useStyles()
  const mystery = getMystery(intention.currentMystery)
  const {pray} = useIntentions()

  return (
    <Card className={classes.card}>
      <Grid container={true} justifyContent="center" alignItems="center">
        <Avatar alt="..." src={mystery.image} className={classes.bigAvatar} />
      </Grid>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom={true} variant="h5" component="h2">
          {mystery.title}
        </Typography>
        <Typography>{mystery.description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          data-testid="pray-save-button"
          onClick={() => pray(intention)}
        >
          Gotowe (zapisz)
        </Button>
      </CardActions>
    </Card>
  )
}
