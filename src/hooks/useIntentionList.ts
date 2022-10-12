import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

export const useIntentionList = () => {
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    [],
  )
  const intentions = intentionList ?? []

  const deleteIntention = (id: string) =>
    saveIntentionList(intentions.filter((x) => x.id !== id))

  return {
    intentions,
    saveIntentionList,
    deleteIntention,
  }
}
