import api from '../../services/api'
import {useRequest} from '../useRequest'

const emptyStatisticRequest = {
  id: null,
  intention: null,
  rosaryCount: null,
  prayFinished: null,
  prayInProgress: null,
}

export const useIntentionStatisticRequest = () => {
  const {
    state: {
      data: {rosaryCount, prayFinished, prayInProgress},
      isLoading: isStatisticRequestLoading,
    },
    doRequest: requestIntentionStatistic,
  } = useRequest(
    api.post,
    'intention_statistic_requests',
    emptyStatisticRequest,
  )

  return {
    rosaryCount,
    prayFinished,
    prayInProgress,
    isStatisticRequestLoading,
    requestIntentionStatistic,
  }
}
