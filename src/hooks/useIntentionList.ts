import {IIntention} from 'src/pages/IntentionPage/Interface'
import {useLocalStorage} from 'react-use'

export const useIntentionList = () => {
  const [intentionList, saveIntentionList, removeIntentionList] =
    useLocalStorage<IIntention[]>('rosary-intentions', [])

  return {
    intentionList: intentionList ?? [],
    saveIntentionList,
    removeIntentionList,
  }
}
