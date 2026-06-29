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

interface ResetConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ResetConfirmDialog: FC<ResetConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const {t} = useTranslation()
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-description"
    >
      <DialogTitle id="reset-dialog-title">{t('prayer.resetTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-dialog-description">
          {t('prayer.resetBody')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          {t('prayer.resetConfirm')}
        </Button>
        <Button onClick={onClose} color="inherit">
          {t('prayer.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
