import {
  Badge,
  Card,
  CardContent,
  LinearProgress,
  makeStyles,
  Tooltip,
} from '@mui/material'
import React, {FC} from 'react'
import {CircularProgressWithLabel} from './CircularProgress'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import rosarySVG from '../../rosary2.svg'

interface IIntentionStatisticProps {
  rosaryCount: number
  prayFinished: number
  prayInProgress: number
  timeLeft: number
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginLeft: theme.spacing(1),
    width: 30,
  },
}))

const normalise = (value: number) => (value * 100) / 600

export const IntentionStatisticCard: FC<IIntentionStatisticProps> = ({
  rosaryCount,
  prayFinished,
  prayInProgress,
  timeLeft,
}) => {
  const rosariesFinished = rosaryCount > 0 ? rosaryCount - 1 : 0
  const progress = (prayFinished - rosariesFinished * 20) * 5

  const classes = useStyles()

  return (
    <Card>
      <CardContent>
        <Tooltip title="Ukończonych różańców">
          <Badge color="secondary" badgeContent={rosariesFinished}>
            <img src={rosarySVG} className={classes.icon} alt="rosary" />
          </Badge>
        </Tooltip>
        <Tooltip title="Ukończonych dziesiątków">
          <Badge color="secondary" badgeContent={prayFinished}>
            <CheckCircleIcon className={classes.icon} />
          </Badge>
        </Tooltip>
        <Tooltip title="Modlitw w trakcie">
          <Badge color="secondary" badgeContent={prayInProgress}>
            <AvTimerIcon className={classes.icon} />
          </Badge>
        </Tooltip>
        <Tooltip title="Aktualny różaniec">
          <Badge color="secondary" badgeContent={0}>
            <CircularProgressWithLabel
              value={progress}
              variant="static"
              className={classes.icon}
            />
          </Badge>
        </Tooltip>
        <LinearProgress variant="determinate" value={normalise(timeLeft)} />
      </CardContent>
    </Card>
  )
}
