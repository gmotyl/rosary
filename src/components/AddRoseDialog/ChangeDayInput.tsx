import {useEffect, useRef, useState} from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import {useTranslation} from 'react-i18next'

import {ChangeDay, Weekday} from 'src/utils/roseChangeDay'
import {NTHS, WEEKDAYS, ordinalLabel} from './formatChangeDay'

type NthWeekday = Extract<ChangeDay, {kind: 'nthWeekday'}>
type DayOfMonth = Extract<ChangeDay, {kind: 'dayOfMonth'}>

const DEFAULT_WEEKDAY_RULE: NthWeekday = {
  kind: 'nthWeekday',
  nth: 1,
  weekday: 'sun',
}
const DEFAULT_DAY_RULE: DayOfMonth = {kind: 'dayOfMonth', day: 1}

const parseNth = (value: string): NthWeekday['nth'] =>
  value === 'last' ? 'last' : (Number(value) as 1 | 2 | 3 | 4)

export interface ChangeDayInputProps {
  value: ChangeDay
  onChange: (rule: ChangeDay) => void
}

// "Dzień tygodnia / Dzień miesiąca" toggle with either the
// [pierwsza…ostatnia] × [poniedziałek…niedziela] selects or a 1–31 number.
// Shared by AddRoseDialog and the rose's Zmień tab.
export const ChangeDayInput = ({value, onChange}: ChangeDayInputProps) => {
  const {t} = useTranslation()

  // Remember the other mode's last rule so toggling back restores it
  const lastWeekdayRule = useRef<NthWeekday>(
    value.kind === 'nthWeekday' ? value : DEFAULT_WEEKDAY_RULE,
  )
  const lastDayRule = useRef<DayOfMonth>(
    value.kind === 'dayOfMonth' ? value : DEFAULT_DAY_RULE,
  )
  if (value.kind === 'nthWeekday') lastWeekdayRule.current = value
  else lastDayRule.current = value

  // The number field may hold a half-typed value; only valid days are emitted
  const [dayDraft, setDayDraft] = useState(String(lastDayRule.current.day))
  const day = value.kind === 'dayOfMonth' ? value.day : undefined
  useEffect(() => {
    if (day !== undefined) setDayDraft(String(day))
  }, [day])

  const onDayChange = (text: string) => {
    setDayDraft(text)
    const n = Number(text)
    if (Number.isInteger(n) && n >= 1 && n <= 31) {
      onChange({kind: 'dayOfMonth', day: n})
    }
  }

  return (
    <Stack spacing={1.5}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        color="primary"
        value={value.kind}
        onChange={(_, kind: ChangeDay['kind'] | null) => {
          if (kind === 'nthWeekday') onChange(lastWeekdayRule.current)
          if (kind === 'dayOfMonth') onChange(lastDayRule.current)
        }}
        sx={{'& .MuiToggleButton-root': {textTransform: 'none'}}}
      >
        <ToggleButton value="nthWeekday">
          {t('rose.changeDay.modeWeekday')}
        </ToggleButton>
        <ToggleButton value="dayOfMonth">
          {t('rose.changeDay.modeMonthDay')}
        </ToggleButton>
      </ToggleButtonGroup>

      {value.kind === 'nthWeekday' ? (
        <Stack direction="row" spacing={1}>
          <TextField
            select
            fullWidth
            size="small"
            id="rose-change-nth"
            label={t('rose.changeDay.nthLabel')}
            value={String(value.nth)}
            onChange={(e) =>
              onChange({...value, nth: parseNth(e.target.value)})
            }
            SelectProps={{native: true}}
          >
            {NTHS.map((nth) => (
              <option key={nth} value={String(nth)}>
                {ordinalLabel(nth, t)}
              </option>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            size="small"
            id="rose-change-weekday"
            label={t('rose.changeDay.weekdayLabel')}
            value={value.weekday}
            onChange={(e) =>
              onChange({...value, weekday: e.target.value as Weekday})
            }
            SelectProps={{native: true}}
          >
            {WEEKDAYS.map((weekday) => (
              <option key={weekday} value={weekday}>
                {t(`rose.changeDay.weekday.${weekday}`)}
              </option>
            ))}
          </TextField>
        </Stack>
      ) : (
        <TextField
          type="number"
          size="small"
          id="rose-change-day"
          label={t('rose.changeDay.dayLabel')}
          value={dayDraft}
          onChange={(e) => onDayChange(e.target.value)}
          onBlur={() => setDayDraft(String(value.day))}
          inputProps={{min: 1, max: 31, step: 1, inputMode: 'numeric'}}
        />
      )}
    </Stack>
  )
}
