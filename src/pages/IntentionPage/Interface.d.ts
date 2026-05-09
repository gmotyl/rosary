import {MysteryTypes} from 'src/consts/MysteryTypes'

export interface IIntention {
  id: string
  title: string
  description: string
  currentMystery: MysteryTypes
  completedRosaries?: number
}
