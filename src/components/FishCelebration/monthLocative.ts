import {TFunction} from 'i18next'

// Month name as used after "w"/"in" in the month counter ("październiku",
// "October"); month is 0-11 as in Date#getMonth
export const monthLocative = (month: number, t: TFunction): string =>
  t(`rose.monthLocative.${month}`)

// "23 z 31 dni w październiku" — shared by the celebration and the today card
export const formatMonthCounter = (
  prayed: number,
  days: number,
  month: string,
  t: TFunction,
): string => t('rose.monthCounter', {prayed, days, month})
