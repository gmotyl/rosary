import {FormControl, MenuItem, Select, SelectChangeEvent} from '@mui/material'
import {useTranslation} from 'react-i18next'

import {SUPPORTED_LANGUAGES, SupportedLanguage} from 'src/i18n'

export const LanguageSwitcher = () => {
  const {t, i18n} = useTranslation()

  const handleChange = (e: SelectChangeEvent<string>) => {
    const lng = e.target.value as SupportedLanguage
    i18n.changeLanguage(lng)
  }

  return (
    <FormControl size="small" sx={{minWidth: 140}}>
      <Select
        value={i18n.resolvedLanguage ?? 'en'}
        onChange={handleChange}
        aria-label={t('languageSwitcher.label')}
      >
        {SUPPORTED_LANGUAGES.map((lng) => (
          <MenuItem key={lng} value={lng}>
            {t(`languageSwitcher.${lng}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
