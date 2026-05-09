import {getMystery} from '../rosary'
import {MysteryTypes} from '../MysteryTypes'
import type {TFunction} from 'i18next'

const fakeT = ((key: string) => key) as unknown as TFunction

test('Rosary helper returns correct mystery key by type', () => {
  expect(getMystery(MysteryTypes.Joyful1, fakeT).title).toBe('mysteries.joyful1.title')
  expect(getMystery(MysteryTypes.Luminous2, fakeT).title).toBe('mysteries.luminous2.title')
  expect(getMystery(MysteryTypes.Glorious3, fakeT).title).toBe('mysteries.glorious3.title')
  expect(getMystery(21 as MysteryTypes, fakeT).title).toBe('prayer.rosaryCompleteTitle')
})
