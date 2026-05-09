import {FC, forwardRef} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import {TransitionProps} from '@mui/material/transitions'
import {useTranslation} from 'react-i18next'

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
  const {t} = useTranslation()
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
        {t('intentions.deleteConfirmTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t('intentions.deleteConfirmBody')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="secondary">
          {t('intentions.delete')}
        </Button>
        <Button onClick={handleClose} color="primary">
          {t('intentions.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
