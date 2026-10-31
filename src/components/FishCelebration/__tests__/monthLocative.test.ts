import i18n from 'src/i18n'
import {formatMonthCounter, monthLocative} from '..'

const counter = (lng: string, prayed: number, days: number, month: number) => {
  const t = i18n.getFixedT(lng)
  return formatMonthCounter(prayed, days, monthLocative(month, t), t)
}

describe('formatMonthCounter', () => {
  it('uses the singular noun for one prayed day where it agrees with it', () => {
    expect(counter('fr', 1, 31, 9)).toBe('1 jour sur 31 en octobre')
    expect(counter('it', 1, 31, 9)).toBe('1 giorno su 31 in ottobre')
    expect(counter('en', 1, 31, 9)).toBe('1 of 31 days in October')
    expect(counter('pl', 1, 31, 9)).toBe('1 z 31 dni w październiku')
    expect(counter('de', 1, 31, 9)).toBe('1 von 31 Tagen im Oktober')
    expect(counter('es', 1, 31, 9)).toBe('1 de 31 días en octubre')
  })

  it('uses the plural noun for several prayed days', () => {
    expect(counter('fr', 23, 31, 9)).toBe('23 jours sur 31 en octobre')
    expect(counter('it', 23, 31, 9)).toBe('23 giorni su 31 in ottobre')
    expect(counter('pl', 23, 31, 9)).toBe('23 z 31 dni w październiku')
    expect(counter('pl', 2, 30, 8)).toBe('2 z 30 dni we wrześniu')
  })
})
