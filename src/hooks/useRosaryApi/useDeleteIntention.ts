import {authApi} from 'src/services/api'
import {useRequest} from '../useRequest'

export const useDeleteIntention = (authToken: string) => {
  const {
    doRequest,
    state: {isLoading},
  } = useRequest(authApi(authToken).delete, 'intentions', {})
  const deleteIntention = (id: string) => doRequest({}, `intentions/${id}`)

  return {deleteIntention, isLoading}
}
