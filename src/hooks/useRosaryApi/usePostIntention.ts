import {useRequest} from '../useRequest'
import {authApi} from 'src/services/api'
import {IIntention} from 'src/pages/IntentionPage/Interface'

export const emptyIntention: Partial<IIntention> = {
  title: '',
  description: '',
}

export const usePostIntention = (authToken: string) => {
  const {
    state: {isLoading, success},
    doRequest: postIntention,
  } = useRequest(authApi(authToken).post, 'intentions', emptyIntention)

  return {isLoading, success, postIntention}
}
