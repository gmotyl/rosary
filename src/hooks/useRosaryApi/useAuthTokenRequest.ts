import api from 'src/services/api'
import {useRequest} from '../useRequest'

export const useAuthTokenRequest = () => {
  const {state, doRequest: requestAuthToken} = useRequest(
    api.post,
    'authentication_token',
    {},
  )
  const token = state.data.token

  return {
    token,
    requestAuthToken,
    isLoading: state.isLoading,
    error: state.error,
  }
}
