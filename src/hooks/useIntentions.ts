import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'
import {useTranslation} from 'react-i18next'
import {TFunction} from 'i18next'

import {pipe, filter, map} from 'lodash/fp'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {ALL_DECADES_MASK, bitForMystery} from 'src/utils/rosaryGroups'
import {useState} from 'react'

const removeId = (id: string) => filter<IIntention>((x) => x.id !== id)
const isSameId = (id: string) => (x: IIntention) => x.id === id

const buildDefaultIntention = (t: TFunction): IIntention => ({
  id: 'default',
  title: t('prayer.default.title'),
  description: t('prayer.default.description'),
  currentMystery: MysteryTypes.Joyful1,
})

export const useIntentions = (initialIntentions?: IIntention[]) => {
  const {t} = useTranslation()
  const seed = initialIntentions ?? [buildDefaultIntention(t)]
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    seed,
  )
  const [intentions, saveIntentions] = useState<IIntention[]>(
    intentionList ?? [],
  )
  const saveList = (x: IIntention[]) => {
    saveIntentions([...x])
    saveIntentionList(x)
  }

  const deleteIntention = (id: string) =>
    pipe(
      removeId(id), //
      saveList,
    )(intentions)

  const saveIntention = (intention: IIntention) =>
    saveList([...intentions, intention])

  const getIntention = (id: string) =>
    intentions.find(isSameId(id)) || buildDefaultIntention(t)

  const updateIntention = (intention: IIntention) =>
    pipe(
      map((x: IIntention) => (x.id === intention.id ? intention : x)),
      saveList,
    )(intentions)

  const completeDecade = (intention: IIntention) => {
    const bit = bitForMystery(intention.currentMystery)
    const mask = (intention.decadesPrayed ?? 0) | bit

    if (mask === ALL_DECADES_MASK) {
      updateIntention({
        ...intention,
        currentMystery: MysteryTypes.Complete,
        currentBead: 0,
        decadesPrayed: 0,
        completedRosaries: (intention.completedRosaries ?? 0) + 1,
      })
      return
    }

    if (intention.currentMystery < MysteryTypes.Glorious5) {
      updateIntention({
        ...intention,
        currentMystery: intention.currentMystery + 1,
        currentBead: 0,
        decadesPrayed: mask,
      })
      return
    }

    // at Glorious5 but mask isn't full — partial rosary
    updateIntention({
      ...intention,
      currentMystery: MysteryTypes.Complete,
      currentBead: 0,
      decadesPrayed: mask,
    })
  }

  const tapBead = (intention: IIntention, beadIndex: number) => {
    if (beadIndex < 10) {
      updateIntention({...intention, currentBead: beadIndex})
      return
    }
    completeDecade(intention)
  }

  return {
    intentions,
    saveIntention,
    deleteIntention,
    getIntention,
    tapBead,
  }
}
