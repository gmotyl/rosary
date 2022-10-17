import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

import {pipe, filter} from 'lodash/fp'

export const useIntentions = () => {
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    [],
  )
  const intentions = intentionList ?? []

  const removeId = (id: string) => filter<IIntention>((x) => x.id !== id)

  const deleteIntention = (id: string) =>
    pipe(
      removeId(id), //
      saveIntentionList,
    )(intentions)

  const saveIntention = (intention: IIntention) =>
    saveIntentionList([...intentions, intention])

  return {
    intentions,
    saveIntention,
    deleteIntention,
  }
}
