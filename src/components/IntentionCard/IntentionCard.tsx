import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import LinearProgress from '@mui/material/LinearProgress'
import {makeStyles} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

import {IIntention} from './Interface'
import Link from '../Link'

const image = '/img/rosary1.jpeg'
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
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
}))

interface IntentionCardProps {
  intention: Partial<IIntention>
  isLoading?: boolean
  detailed?: boolean
  onDeleteAction?: (id: string) => void
}

const IntentionCard: React.ComponentType<IntentionCardProps> = ({
  intention,
  detailed,
  onDeleteAction,
  isLoading,
}) => {
  const classes = useStyles()
  const description = detailed && (
    <Typography>{intention.description}</Typography>
  )
  const deleteAction = onDeleteAction && (
    <Button
      size="small"
      onClick={() => onDeleteAction(intention.id ?? '')}
      data-testid="delete-intention"
    >
      <DeleteIcon color="secondary" />
    </Button>
  )
  const actions = !detailed && (
    <CardActions>
      <Button size="small" color="primary">
        <Link to={`/intention/${intention.id}`}>Dalej</Link>
      </Button>
      {deleteAction}
    </CardActions>
  )

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={image}
        title="Image title"
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom={true} variant="h5" component="h2">
          {isLoading ? <LinearProgress variant="query" /> : intention.title}
        </Typography>
        {isLoading ? <LinearProgress variant="query" /> : description}
      </CardContent>
      {actions}
    </Card>
  )
}

export default IntentionCard
