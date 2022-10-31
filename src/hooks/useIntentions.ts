import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

import {pipe, filter, map} from 'lodash/fp'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const removeId = (id: string) => filter<IIntention>((x) => x.id !== id)
const isNotCompleted = (x: IIntention) =>
  x.currentMystery < MysteryTypes.Complete
const isSameId = (id: string) => (x: IIntention) => x.id === id

export const useIntentions = (initialIntentions: IIntention[] = []) => {
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    initialIntentions,
  )

  const deleteIntention = (id: string) =>
    pipe(
      removeId(id), //
      saveIntentionList,
    )(intentionList)

  const saveIntention = (intention: IIntention) =>
    saveIntentionList([...(intentionList ?? []), intention])

  const getIntention = (id: string) => (intentionList ?? []).find(isSameId(id))

  const pray = (intention: IIntention) =>
    isNotCompleted(intention)
      ? pipe(
          map((x: IIntention) =>
            x.id === intention.id
              ? {...x, currentMystery: x.currentMystery + 1}
              : x,
          ),
          saveIntentionList,
        )(intentionList)
      : () => {}

  return {
    intentions: intentionList ?? [],
    saveIntention,
    deleteIntention,
    getIntention,
    pray,
  }
}
