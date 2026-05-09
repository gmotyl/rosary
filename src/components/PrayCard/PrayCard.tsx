import {Grid} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import {makeStyles} from '@mui/styles'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {useIntentions} from 'src/hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'

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
  },
}))

interface PrayCardProps {
  id: string
}

export const PrayCard: React.ComponentType<PrayCardProps> = ({id}) => {
  const {t} = useTranslation()
  const {pray, getIntention} = useIntentions()
  const intention = getIntention(id)
  const classes = useStyles()
  const mystery = getMystery(intention.currentMystery, t)

  const button =
    intention.currentMystery === MysteryTypes.Complete ? (
      <Button
        size="small"
        color="primary"
        data-testid="pray-reload-button"
        onClick={() => pray(intention)}
      >
        {t('prayer.restart')} 🔁
      </Button>
    ) : (
      <Button
        size="small"
        color="primary"
        data-testid="pray-next-button"
        onClick={() => pray(intention)}
      >
        {t('prayer.next')} ⏭
      </Button>
    )

  return (
    <Card className={classes.card}>
      <Grid container={true} justifyContent="center" alignItems="center">
        <Avatar
          alt="..."
          src={mystery.image}
          className={classes.bigAvatar}
          sx={{width: 250, height: 250}}
        />
      </Grid>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom={true} variant="h5" component="h2">
          {mystery.title}
        </Typography>
        <Typography>{mystery.description}</Typography>
        {(intention.completedRosaries ?? 0) > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            data-testid="completed-rosaries"
            sx={{display: 'block', mt: 1}}
          >
            {t('intentions.completedRosariesLabel')}: {intention.completedRosaries}
          </Typography>
        )}
      </CardContent>
      <CardActions>{button}</CardActions>
    </Card>
  )
}
