import {rosary} from './rosary_pl'
import {MysteryTypes} from './MysteryTypes'

export interface Mystery {
  type: MysteryTypes
  title: string
  description: string
  image: string
}

export const getMystery = (type: MysteryTypes) => {
  if (!type || type < 1 || type > 20) {
    return {
      type: 0,
      title: 'Różaniec zakończony. Chwała Panu!',
      description: '',
      image: '/img/rosary1.jpeg',
    }
  }

  const mystery = rosary.find(mysteryByType(type))

  return {
    type,
    title: mystery!.title,
    description: mystery!.description,
    image: `/img/${type}.jpg`,
  }
}

const mysteryByType = (type: number) => (mystery: Mystery) =>
  mystery.type === type
