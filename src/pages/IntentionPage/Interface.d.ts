import {MysteryTypes} from 'src/consts/MysteryTypes'

export interface IIntention {
  id: string
  userId?: string
  title: string
  description: string
  currentMystery: MysteryTypes
}
