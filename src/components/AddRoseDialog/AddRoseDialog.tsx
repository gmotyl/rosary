import {useState} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {useRoses} from 'src/hooks'
import type {IRose} from 'src/hooks'
import {getMystery} from 'src/consts/rosary'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {MysteryGroup} from 'src/utils/rosaryGroups'
import {ChangeDay} from 'src/utils/roseChangeDay'
import {ChangeDayInput} from './ChangeDayInput'

// The 20 mysteries in prayer order, five per part
const MYSTERY_GROUPS = [
  MysteryGroup.Joyful,
  MysteryGroup.Luminous,
  MysteryGroup.Sorrowful,
  MysteryGroup.Glorious,
].map((group, g) => ({
  group,
  mysteries: [1, 2, 3, 4, 5].map((i) => (g * 5 + i) as MysteryTypes),
}))

// Mockup default: first Sunday of the month
const DEFAULT_RULE: ChangeDay = {kind: 'nthWeekday', nth: 1, weekday: 'sun'}

interface AddRoseDialogProps {
  open: boolean
  onClose: () => void
  onAdded?: (rose: IRose) => void
}

export const AddRoseDialog = ({open, onClose, onAdded}: AddRoseDialogProps) => {
  const {t} = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby="add-rose-title"
      PaperProps={{sx: {borderRadius: 4, m: 2, width: 'calc(100% - 32px)'}}}
    >
      <DialogTitle
        id="add-rose-title"
        sx={{fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600}}
      >
        {t('rose.add.title')}
      </DialogTitle>
      {/* Unmounted while closed, so every opening starts with a fresh form */}
      <AddRoseForm onClose={onClose} onAdded={onAdded} />
    </Dialog>
  )
}

const AddRoseForm = ({
  onClose,
  onAdded,
}: Pick<AddRoseDialogProps, 'onClose' | 'onAdded'>) => {
  const {t} = useTranslation()
  const history = useHistory()
  const {addRose} = useRoses()
  const [name, setName] = useState('')
  const [mystery, setMystery] = useState<MysteryTypes>(MysteryTypes.Joyful1)
  const [changeDay, setChangeDay] = useState<ChangeDay>(DEFAULT_RULE)

  const canSave = name.trim().length > 0

  const save = () => {
    if (!canSave) return
    const rose = addRose({name, mystery, changeDay})
    onClose()
    onAdded?.(rose)
    history.push(`/rose/${rose.id}/pray`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <DialogContent sx={{pt: 1}}>
        <Stack spacing={2.5} sx={{pt: 1}}>
          <TextField
            autoFocus
            fullWidth
            id="add-rose-name"
            label={t('rose.add.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            select
            fullWidth
            id="add-rose-mystery"
            label={t('rose.add.mystery')}
            value={String(mystery)}
            onChange={(e) => setMystery(Number(e.target.value) as MysteryTypes)}
            SelectProps={{native: true}}
          >
            {MYSTERY_GROUPS.map(({group, mysteries}) => (
              <optgroup key={group} label={t(`mysteries.groupTitle.${group}`)}>
                {mysteries.map((type) => (
                  <option key={type} value={String(type)}>
                    {getMystery(type, t).title}
                  </option>
                ))}
              </optgroup>
            ))}
          </TextField>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{mb: 1, fontSize: 12}}>
              {t('rose.add.changeDay')}
            </FormLabel>
            <ChangeDayInput value={changeDay} onChange={setChangeDay} />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{px: 3, pb: 2}}>
        <Button onClick={onClose} sx={{borderRadius: 999}}>
          {t('rose.add.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!canSave}
          disableElevation
          sx={{borderRadius: 999, px: 2.5}}
        >
          {t('rose.add.submit')}
        </Button>
      </DialogActions>
    </form>
  )
}
