import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {makeStyles} from '@mui/material/styles'
import React, {FC, useState} from 'react'
import Hero from 'src/components/Hero'
import IntentionCard from 'src/components/IntentionCard'
import {useIntentionList, useDeleteIntention} from 'src/hooks/useRosaryApi'
import {EAuthRoles, AuthContext} from 'src/context/AuthProvider'
import {DeleteIntentionDialog} from 'src/components/DeleteIntentionDialog'

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
  },
}))

interface IntentionListProps {}

const IntentionList: FC<IntentionListProps> = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIntentionId, setDeleteIntentionId] = useState('')
  const classes = useStyles()
  const {intentions} = useIntentionList()
  const {hasRole, authToken} = React.useContext(AuthContext)
  const isAdmin = hasRole(EAuthRoles.ROLE_ADMIN)
  const openDeleteIntentionDialog = isAdmin
    ? (intentionId: string) => {
        setDeleteIntentionId(intentionId)
        setDeleteDialogOpen(true)
      }
    : undefined
  const {deleteIntention, isLoading} = useDeleteIntention(authToken)
  const handleDeleteIntention = () => {
    deleteIntention(deleteIntentionId)
  }

  React.useEffect(() => {
    setDeleteDialogOpen(isLoading)
  }, [isLoading])

  return (
    <>
      <Hero />
      <Container
        className={classes.cardGrid}
        maxWidth="md"
        data-testid="intention-list"
      >
        {/* End hero unit */}
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
