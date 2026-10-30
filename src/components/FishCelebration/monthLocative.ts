import {TFunction} from 'i18next'

// Month with its preposition as it ends the month counter ("w październiku",
// "we wrześniu", "in October"). The preposition lives in the value, not the
// template, because Polish switches "w" to "we" before some months;
// month is 0-11 as in Date#getMonth
export const monthLocative = (month: number, t: TFunction): string =>
  t(`rose.monthLocative.${month}`)

// "23 z 31 dni w październiku" — shared by the celebration and the today card
export const formatMonthCounter = (
  prayed: number,
  days: number,
  month: string,
  t: TFunction,
): string => t('rose.monthCounter', {prayed, days, month})
