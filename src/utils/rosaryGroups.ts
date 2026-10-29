import {MysteryTypes} from 'src/consts/MysteryTypes'
import {IIntention} from 'src/pages/IntentionPage/Interface'

export enum MysteryGroup {
  Joyful = 'joyful',
  Luminous = 'luminous',
  Sorrowful = 'sorrowful',
  Glorious = 'glorious',
}

export const ALL_DECADES_MASK = 0xfffff // 20 bits

export const groupOf = (mystery: MysteryTypes): MysteryGroup => {
  if (mystery >= MysteryTypes.Joyful1 && mystery <= MysteryTypes.Joyful5) {
    return MysteryGroup.Joyful
  }
  if (mystery >= MysteryTypes.Luminous1 && mystery <= MysteryTypes.Luminous5) {
    return MysteryGroup.Luminous
  }
  if (mystery >= MysteryTypes.Sorrowful1 && mystery <= MysteryTypes.Sorrowful5) {
    return MysteryGroup.Sorrowful
  }
  return MysteryGroup.Glorious
}

export const firstMysteryOfGroup = (group: MysteryGroup): MysteryTypes => {
  switch (group) {
    case MysteryGroup.Joyful:
      return MysteryTypes.Joyful1
    case MysteryGroup.Luminous:
      return MysteryTypes.Luminous1
    case MysteryGroup.Sorrowful:
      return MysteryTypes.Sorrowful1
    case MysteryGroup.Glorious:
      return MysteryTypes.Glorious1
  }
}

export const decadeIndex = (mystery: MysteryTypes): number => {
  const first = firstMysteryOfGroup(groupOf(mystery))
  return mystery - first + 1
}

export const bitForMystery = (mystery: MysteryTypes): number =>
  1 << (mystery - 1)

// true when finishing the current decade turns the intention into MysteryTypes.Complete
export const willCompleteRosary = (intention: IIntention): boolean => {
  const mask = (intention.decadesPrayed ?? 0) | bitForMystery(intention.currentMystery)
  return mask === ALL_DECADES_MASK || intention.currentMystery >= MysteryTypes.Glorious5
}
