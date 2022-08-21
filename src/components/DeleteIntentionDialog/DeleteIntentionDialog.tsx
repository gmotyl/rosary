import {FC, forwardRef} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import {TransitionProps} from '@mui/material/transitions'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {children?: React.ReactElement<any, any>},
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...(props as any)} />
})

interface DeleteIntentionDialogProps {
  open: boolean
  handleClose: () => void
  onDelete: () => void
}

export const DeleteIntentionDialog: FC<DeleteIntentionDialogProps> = ({
  open,
  handleClose,
  onDelete,
}) => {
  // const [open, setOpen] = React.useState(false)

  // const handleClickOpen = () => {
  // setOpen(true)
  // }

  // const handleClose = () => {
  // setOpen(false)
  // }
  // {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
  //   Slide in alert dialog
  // </Button> */}

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {'Delete intention?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you shure you want to delete this intention ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="secondary">
          Delete
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
