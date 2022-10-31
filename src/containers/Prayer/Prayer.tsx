import {Grid} from '@mui/material'
import {PrayCard} from 'src/components/PrayCard'
import {IIntention} from 'src/pages/IntentionPage/Interface'

interface PrayerProps {
  intention: IIntention
  updateStats: () => void
}

export const Prayer: React.ComponentType<PrayerProps> = ({intention}) => {
  return (
    <Grid container={true} spacing={2}>
      <PrayCard intention={intention} />
    </Grid>
  )
}
