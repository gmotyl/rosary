import {TFunction} from 'i18next'
import {ChangeDay, Weekday} from 'src/utils/roseChangeDay'

export const WEEKDAYS: Weekday[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]

export const NTHS: Array<1 | 2 | 3 | 4 | 'last'> = [1, 2, 3, 4, 'last']

// Ordinal as offered in the select ("pierwsza", "druga", …)
export const ordinalLabel = (nth: 1 | 2 | 3 | 4 | 'last', t: TFunction) =>
  t(`rose.changeDay.ordinal.${nth}`)

// Rule as running text: "druga sobota", "pierwszy poniedziałek",
// "15. dzień miesiąca". The ordinal agrees with the weekday's grammatical
// gender through an i18next context (rose.changeDay.gender.<weekday>), so
// locales without gender agreement simply leave the map out.
export const formatChangeDay = (rule: ChangeDay, t: TFunction): string => {
  if (rule.kind === 'dayOfMonth') {
    return t('rose.changeDay.dayOfMonthRule', {day: rule.day})
  }
  const context = t(`rose.changeDay.gender.${rule.weekday}`, {
    defaultValue: '',
  })
  return t('rose.changeDay.weekdayRule', {
    nth: t(`rose.changeDay.ordinal.${rule.nth}`, {context}),
    weekday: t(`rose.changeDay.weekday.${rule.weekday}`),
  })
}
