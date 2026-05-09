import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {makeStyles} from '@mui/styles'
import {FC, useState} from 'react'
import Hero from 'src/components/Hero'
import IntentionCard from 'src/components/IntentionCard'
import {DeleteIntentionDialog} from 'src/components/DeleteIntentionDialog'
import {useIntentions} from 'src/hooks'

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
  },
}))

const IntentionList: FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIntentionId, setDeleteIntentionId] = useState('')
  const classes = useStyles()
  const {intentions, deleteIntention} = useIntentions()

  const openDeleteIntentionDialog = (intentionId: string) => {
    setDeleteIntentionId(intentionId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteIntention = () => {
    deleteIntention(deleteIntentionId)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Hero />
      <Container
        className={classes.cardGrid}
        maxWidth="md"
        data-testid="intention-list"
      >
        <Grid container={true} spacing={4}>
          {intentions.map((intention) => (
            <Grid item={true} key={intention.id} xs={12} sm={6} md={4}>
              <IntentionCard
                intention={intention}
                onDeleteAction={openDeleteIntentionDialog}
              />
            </Grid>
          ))}
        </Grid>
        <DeleteIntentionDialog
          open={deleteDialogOpen}
          handleClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDeleteIntention}
        />
      </Container>
    </>
  )
}

export default IntentionList
