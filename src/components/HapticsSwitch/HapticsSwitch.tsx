import {useState} from 'react'
import {FormControlLabel, Switch} from '@mui/material'
import {useTranslation} from 'react-i18next'

import {
  getHapticsEnabled,
  isHapticsSupported,
  setHapticsEnabled,
} from 'src/tools/haptics'

export const HapticsSwitch = () => {
  const {t} = useTranslation()
  const [enabled, setEnabled] = useState(getHapticsEnabled)

  // Devices that cannot vibrate get no switch at all
  if (!isHapticsSupported()) return null

  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>, on: boolean) => {
    setEnabled(on)
    setHapticsEnabled(on)
  }

  return (
    <FormControlLabel
      control={<Switch checked={enabled} onChange={handleChange} />}
      label={t('hapticsSwitch.label')}
    />
  )
}
