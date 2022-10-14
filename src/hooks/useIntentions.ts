import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

export const useIntentions = () => {
  const [intentionList, saveIntentionList] = useLocalStorage<IIntention[]>(
    'rosary-intentions',
    [],
  )
  const intentions = intentionList ?? []

  const deleteIntention = (id: string) =>
    saveIntentionList(intentions.filter((x) => x.id !== id))

  const saveIntention = (intention: IIntention) =>
    saveIntentionList([...intentions, intention])

  return {
    intentions,
    saveIntention,
    deleteIntention,
  }
}
