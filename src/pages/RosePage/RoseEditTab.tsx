import {useState} from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {ERoutes} from 'src/app/config/routes'
import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {useRoses} from 'src/hooks'
import {ChangeDay} from 'src/utils/roseChangeDay'
import {
  ChangeDayInput,
  MysterySelect,
  formatChangeDay,
} from 'src/components/AddRoseDialog'
import {splitTitle} from './RosePrayTab'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type Field = 'name' | 'mystery' | 'changeDay'

const DIALOG_PAPER = {sx: {borderRadius: 4, m: 2, width: 'calc(100% - 32px)'}}
const DIALOG_TITLE_SX = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontWeight: 600,
}

interface RoseEditTabProps {
  id: string
}

export const RoseEditTab: React.FC<RoseEditTabProps> = ({id}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const {getRose, updateRose, deleteRose} = useRoses()
  const rose = getRose(id)
  const [editing, setEditing] = useState<Field | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // RosePage redirects unknown ids; this only covers a rose deleted meanwhile
  if (!rose) return null

  const {label, name} = splitTitle(getMystery(rose.mystery, t).title)
  const ruleText = capitalize(formatChangeDay(rose.changeDay, t))

  const rows: {field: Field; label: string; value: string}[] = [
    {field: 'name', label: t('rose.edit.name'), value: rose.name},
    {
      field: 'mystery',
      label: t('rose.edit.mystery'),
      value: label ? `${label} — ${name}` : name,
    },
    {
      field: 'changeDay',
      label: t('rose.edit.changeDay'),
      value:
        rose.changeDay.kind === 'nthWeekday'
          ? t('rose.edit.monthlyRule', {rule: ruleText})
          : ruleText,
    },
  ]

  const close = () => setEditing(null)

  const onDelete = () => {
    setConfirmDelete(false)
    deleteRose(id)
    history.push(ERoutes.HOME)
  }

  return (
    <Box data-testid="rose-edit-tab" sx={{px: 2, pt: 1}}>
      {rows.map((r, i) => (
        <Box
          key={r.field}
          data-testid={`rose-edit-${r.field}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            py: 1.5,
            borderTop: i === 0 ? 0 : 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{minWidth: 0}}>
            <Typography
              component="span"
              sx={{display: 'block', fontSize: 12, color: 'text.secondary'}}
            >
              {r.label}
            </Typography>
            <Typography component="span" sx={{fontSize: 15}}>
              {r.value}
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={() => setEditing(r.field)}
            sx={{fontWeight: 600, flexShrink: 0, textTransform: 'none'}}
          >
            {t('rose.edit.change')}
          </Button>
        </Box>
      ))}

      <Box sx={{py: 1.5, borderTop: 1, borderColor: 'divider'}}>
        <Button
          color="error"
          onClick={() => setConfirmDelete(true)}
          sx={{fontWeight: 600, px: 0, textTransform: 'none'}}
        >
          {t('rose.edit.delete')}
        </Button>
      </Box>

      <EditDialog
        field="name"
        open={editing === 'name'}
        title={t('rose.edit.renameTitle')}
        initial={rose.name}
        onClose={close}
        canSave={(value) => value.trim().length > 0}
        onSave={(value) => updateRose(id, {name: value})}
        render={(value, setValue) => (
          <TextField
            autoFocus
            fullWidth
            id="rose-edit-name-input"
            label={t('rose.edit.name')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      />
      <EditDialog<MysteryTypes>
        field="mystery"
        open={editing === 'mystery'}
        title={t('rose.edit.mysteryTitle')}
        initial={rose.mystery}
        onClose={close}
        onSave={(value) => updateRose(id, {mystery: value})}
        render={(value, setValue) => (
          <MysterySelect
            id="rose-edit-mystery-input"
            label={t('rose.edit.mystery')}
            value={value}
            onChange={setValue}
          />
        )}
      />
      <EditDialog<ChangeDay>
        field="changeDay"
        open={editing === 'changeDay'}
        title={t('rose.edit.changeDayTitle')}
        initial={rose.changeDay}
        onClose={close}
        onSave={(value) => updateRose(id, {changeDay: value})}
        render={(value, setValue) => (
          <ChangeDayInput value={value} onChange={setValue} />
        )}
      />

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="rose-delete-title"
        aria-describedby="rose-delete-body"
        PaperProps={DIALOG_PAPER}
      >
        <DialogTitle id="rose-delete-title" sx={DIALOG_TITLE_SX}>
          {t('rose.edit.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="rose-delete-body">
            {t('rose.edit.deleteConfirmBody', {name: rose.name})}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2}}>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{borderRadius: 999}}
          >
            {t('rose.edit.cancel')}
          </Button>
          <Button
            onClick={onDelete}
            color="error"
            variant="contained"
            disableElevation
            sx={{borderRadius: 999, px: 2.5}}
          >
            {t('rose.edit.deleteConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

interface EditDialogProps<T> {
  field: Field
  open: boolean
  title: string
  initial: T
  onClose: () => void
  onSave: (value: T) => void
  canSave?: (value: T) => boolean
  render: (value: T, setValue: (value: T) => void) => React.ReactNode
}

// Small Zapisz / Anuluj dialog around one field's editor
const EditDialog = <T,>({
  field,
  open,
  title,
  onClose,
  ...form
}: EditDialogProps<T>) => {
  const titleId = `rose-edit-${field}-title`
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby={titleId}
      PaperProps={DIALOG_PAPER}
    >
      <DialogTitle id={titleId} sx={DIALOG_TITLE_SX}>
        {title}
      </DialogTitle>
      {/* Unmounted while closed, so every opening starts from the stored value */}
      <EditForm onClose={onClose} {...form} />
    </Dialog>
  )
}

const EditForm = <T,>({
  initial,
  onClose,
  onSave,
  canSave = () => true,
  render,
}: Omit<EditDialogProps<T>, 'field' | 'open' | 'title'>) => {
  const {t} = useTranslation()
  const [value, setValue] = useState<T>(initial)
  const valid = canSave(value)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid) return
        onSave(value)
        onClose()
      }}
    >
      <DialogContent sx={{pt: 1}}>
        <Box sx={{pt: 1}}>{render(value, setValue)}</Box>
      </DialogContent>
      <DialogActions sx={{px: 3, pb: 2}}>
        <Button onClick={onClose} sx={{borderRadius: 999}}>
          {t('rose.edit.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!valid}
          disableElevation
          sx={{borderRadius: 999, px: 2.5}}
        >
          {t('rose.edit.save')}
        </Button>
      </DialogActions>
    </form>
  )
}

export default RoseEditTab
