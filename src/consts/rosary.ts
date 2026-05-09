import {TFunction} from 'i18next'
import {MysteryTypes} from './MysteryTypes'

const KEY_BY_TYPE: Partial<Record<MysteryTypes, string>> = {
  [MysteryTypes.Joyful1]: 'mysteries.joyful1',
  [MysteryTypes.Joyful2]: 'mysteries.joyful2',
  [MysteryTypes.Joyful3]: 'mysteries.joyful3',
  [MysteryTypes.Joyful4]: 'mysteries.joyful4',
  [MysteryTypes.Joyful5]: 'mysteries.joyful5',
  [MysteryTypes.Luminous1]: 'mysteries.luminous1',
  [MysteryTypes.Luminous2]: 'mysteries.luminous2',
  [MysteryTypes.Luminous3]: 'mysteries.luminous3',
  [MysteryTypes.Luminous4]: 'mysteries.luminous4',
  [MysteryTypes.Luminous5]: 'mysteries.luminous5',
  [MysteryTypes.Sorrowful1]: 'mysteries.sorrowful1',
  [MysteryTypes.Sorrowful2]: 'mysteries.sorrowful2',
  [MysteryTypes.Sorrowful3]: 'mysteries.sorrowful3',
  [MysteryTypes.Sorrowful4]: 'mysteries.sorrowful4',
  [MysteryTypes.Sorrowful5]: 'mysteries.sorrowful5',
  [MysteryTypes.Glorious1]: 'mysteries.glorious1',
  [MysteryTypes.Glorious2]: 'mysteries.glorious2',
  [MysteryTypes.Glorious3]: 'mysteries.glorious3',
  [MysteryTypes.Glorious4]: 'mysteries.glorious4',
  [MysteryTypes.Glorious5]: 'mysteries.glorious5',
}

export interface Mystery {
  type: MysteryTypes
  title: string
  description: string
  image: string
}

export const getMystery = (type: MysteryTypes, t: TFunction): Mystery => {
  if (!type || type < 1 || type > 20) {
    return {
      type: 0,
      title: t('prayer.rosaryCompleteTitle'),
      description: '',
      image: '/img/rosary1.jpeg',
    }
  }
  const baseKey = KEY_BY_TYPE[type]!
  return {
    type,
    title: t(`${baseKey}.title`),
    description: t(`${baseKey}.description`),
    image: `/img/${type}.jpg`,
  }
}
