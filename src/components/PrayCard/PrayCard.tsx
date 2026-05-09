import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {useIntentions} from 'src/hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {RosaryBreadcrumb} from 'src/components/RosaryBreadcrumb'
import {RosaryProgressBars} from 'src/components/RosaryProgressBars'
import {BeadCircle} from 'src/components/BeadCircle'

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
}))

interface PrayCardProps {
  id: string
}

export const PrayCard: React.ComponentType<PrayCardProps> = ({id}) => {
  const {t} = useTranslation()
  const {getIntention, tapBead, jumpToMystery, jumpToGroup, restart, prayNext} =
    useIntentions()
  const intention = getIntention(id)
  const classes = useStyles()
  const mystery = getMystery(intention.currentMystery, t)
  const isComplete = intention.currentMystery === MysteryTypes.Complete
  const displayMystery = isComplete ? MysteryTypes.Glorious5 : intention.currentMystery

  return (
    <Card className={classes.card}>
      <CardContent>
        <RosaryBreadcrumb
          currentMystery={displayMystery}
          onJumpToGroup={(group) => jumpToGroup(intention, group)}
        />
        <RosaryProgressBars
          currentMystery={displayMystery}
          decadesPrayed={intention.decadesPrayed ?? 0}
          onJumpToGroup={(group) => jumpToGroup(intention, group)}
          onJumpToMystery={(m) => jumpToMystery(intention, m)}
        />
      </CardContent>

      {!isComplete && (
        <BeadCircle
          imageSrc={mystery.image}
          currentBead={intention.currentBead ?? 0}
          onTapBead={(n) => tapBead(intention, n)}
        />
      )}

      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
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

      <CardActions>
        {isComplete ? (
          <Button
            size="small"
            color="primary"
            data-testid="pray-reload-button"
            onClick={() => restart(intention)}
          >
            {t('prayer.restart')} 🔁
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            data-testid="pray-next-button"
            onClick={() => prayNext(intention)}
          >
            {t('prayer.next')} ⏭
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
