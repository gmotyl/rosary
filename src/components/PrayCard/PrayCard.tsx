import {Button, Card, CardActions, CardContent, Typography} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {useIntentions} from 'src/hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {DecadeDots} from 'src/components/DecadeDots'
import {RosaryHeader} from 'src/components/RosaryHeader'
import {RosaryLoop} from 'src/components/RosaryLoop'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flexGrow: 1,
    textAlign: 'center',
  },
}))

interface PrayCardProps {
  id: string
}

export const PrayCard: React.ComponentType<PrayCardProps> = ({id}) => {
  const {t} = useTranslation()
  const {getIntention, jumpToMystery, jumpToGroup, restart, prayNext, prayPrev} =
    useIntentions()
  const intention = getIntention(id)
  const classes = useStyles()
  const isComplete = intention.currentMystery === MysteryTypes.Complete
  const displayMystery = isComplete ? MysteryTypes.Glorious5 : intention.currentMystery
  const mystery = getMystery(displayMystery, t)

  return (
    <Card className={classes.card}>
      <CardContent sx={{pb: 0}}>
        <RosaryHeader
          currentMystery={displayMystery}
          mysteryTitle={mystery.title}
          onJumpToGroup={(group) => jumpToGroup(intention, group)}
        />
        <DecadeDots
          currentMystery={displayMystery}
          onJumpToMystery={(m) => jumpToMystery(intention, m)}
        />
      </CardContent>

      {!isComplete && (
        <RosaryLoop
          imageSrc={mystery.image}
          currentBead={intention.currentBead ?? 0}
          currentMystery={intention.currentMystery}
          onAdvance={() => prayNext(intention)}
          onRetreat={() => prayPrev(intention)}
        />
      )}

      <CardContent className={classes.cardContent}>
        {isComplete && (
          <Typography variant="h5" component="h2" sx={{color: 'primary.main'}}>
            {t('prayer.rosaryCompleteTitle')}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
          {mystery.description}
        </Typography>
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

      <CardActions sx={{justifyContent: 'center', pb: 2}}>
        {isComplete ? (
          <Button
            size="large"
            variant="contained"
            color="primary"
            data-testid="pray-reload-button"
            onClick={() => restart(intention)}
          >
            {t('prayer.restart')} 🔁
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            color="primary"
            data-testid="pray-next-button"
            onClick={() => prayNext(intention)}
            sx={{minWidth: 160, borderRadius: 6}}
          >
            {t('prayer.next')} ⏭
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
