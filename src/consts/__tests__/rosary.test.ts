import {getMystery} from '../rosary'
import {MysteryTypes} from '../MysteryTypes'

test('Rosary helper returns correct mystery by type', () => {
  const mystery1 = getMystery(MysteryTypes.Joyful1)
  const mystery7 = getMystery(MysteryTypes.Luminous2)
  const mystery18 = getMystery(MysteryTypes.Glorious3)
  const mystery21 = getMystery(21)

  expect(mystery1.title).toMatch('Zwiastowanie')
  expect(mystery7.title).toMatch('Objawienie')
  expect(mystery18.title).toMatch('Zesłanie Ducha Świętego')
  expect(mystery21.title).toMatch('Różaniec zakończony. Chwała Panu')
})
