import api from 'src/services/api'
import {useRequest} from '../useRequest'

export const useSavePrayer = () => useRequest(api.put, 'prayers', {})
