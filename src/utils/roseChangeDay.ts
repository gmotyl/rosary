import {MysteryTypes} from 'src/consts/MysteryTypes'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type ChangeDay =
  | {kind: 'nthWeekday'; nth: 1 | 2 | 3 | 4 | 'last'; weekday: Weekday}
  | {kind: 'dayOfMonth'; day: number} // 1..31, clamped to the month's last day

// Index matches Date.prototype.getDay() (0 = Sunday)
const WEEKDAY_INDEX: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

const MYSTERY_COUNT = 20

const pad = (n: number): string => String(n).padStart(2, '0')

const formatDate = (year: number, month: number, day: number): string =>
  `${year}-${pad(month + 1)}-${pad(day)}`

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate()

// Parses 'YYYY-MM-DD' into year and 0-based month
const parseYearMonth = (date: string): {year: number; month: number} => {
  const [year, month] = date.split('-').map(Number)
  return {year, month: month - 1}
}

// 'YYYY-MM-DD' of the device's local calendar date, never UTC
export const toLocalDate = (d: Date): string =>
  formatDate(d.getFullYear(), d.getMonth(), d.getDate())

export const changeDateInMonth = (
  rule: ChangeDay,
  year: number,
  month: number,
): string => {
  const lastDay = daysInMonth(year, month)
  if (rule.kind === 'dayOfMonth') {
    return formatDate(year, month, Math.min(Math.max(rule.day, 1), lastDay))
  }
  const target = WEEKDAY_INDEX[rule.weekday]
  if (rule.nth === 'last') {
    const lastWeekday = new Date(year, month, lastDay).getDay()
    return formatDate(year, month, lastDay - ((lastWeekday - target + 7) % 7))
  }
  const firstWeekday = new Date(year, month, 1).getDay()
  const firstOccurrence = 1 + ((target - firstWeekday + 7) % 7)
  return formatDate(year, month, firstOccurrence + (rule.nth - 1) * 7)
}

// Change dates d with afterExclusive < d <= untilInclusive, in ascending order
export const changeDatesBetween = (
  rule: ChangeDay,
  afterExclusive: string,
  untilInclusive: string,
): string[] => {
  if (untilInclusive <= afterExclusive) return []
  const start = parseYearMonth(afterExclusive)
  const end = parseYearMonth(untilInclusive)
  const dates: string[] = []
  let {year, month} = start
  while (year < end.year || (year === end.year && month <= end.month)) {
    const date = changeDateInMonth(rule, year, month)
    if (date > afterExclusive && date <= untilInclusive) dates.push(date)
    month += 1
    if (month > 11) {
      month = 0
      year += 1
    }
  }
  return dates
}

export const latestChangeDateOnOrBefore = (
  rule: ChangeDay,
  date: string,
): string => {
  const {year, month} = parseYearMonth(date)
  const inMonth = changeDateInMonth(rule, year, month)
  if (inMonth <= date) return inMonth
  return month === 0
    ? changeDateInMonth(rule, year - 1, 11)
    : changeDateInMonth(rule, year, month - 1)
}

// Cycles over Joyful1..Glorious5 (20 mysteries), wrapping Glorious5 to Joyful1
export const advanceMystery = (m: MysteryTypes, n: number): MysteryTypes => {
  const offset = m - MysteryTypes.Joyful1
  const next = (((offset + n) % MYSTERY_COUNT) + MYSTERY_COUNT) % MYSTERY_COUNT
  return (MysteryTypes.Joyful1 + next) as MysteryTypes
}
