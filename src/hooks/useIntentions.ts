import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

import {pipe, filter, map} from 'lodash/fp'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {useState} from 'react'

const removeId = (id: string) => filter<IIntention>((x) => x.id !== id)
const isNotCompleted = (x: IIntention) =>
  x.currentMystery < MysteryTypes.Complete
const isSameId = (id: string) => (x: IIntention) => x.id === id

const defaultIntention: IIntention = {
  id: 'default',
  title: 'O Boże błogosławieństwo',
  description: '',
  currentMystery: MysteryTypes.Joyful1,
}

export const useIntentions = (
  initialIntentions: IIntention[] = [defaultIntention],
) => {
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    initialIntentions,
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
    intentions.find(isSameId(id)) || defaultIntention

  const updateIntention = (intention: IIntention) =>
    pipe(
      map((x: IIntention) => (x.id === intention.id ? intention : x)),
      saveList,
    )(intentions)

  const pray = (intention: IIntention) =>
    isNotCompleted(intention)
      ? updateIntention({
          ...intention,
          currentMystery: intention.currentMystery + 1,
        })
      : updateIntention({
          ...intention,
          currentMystery: MysteryTypes.Joyful1,
        })

  return {
    intentions,
    saveIntention,
    deleteIntention,
    getIntention,
    pray,
  }
}
