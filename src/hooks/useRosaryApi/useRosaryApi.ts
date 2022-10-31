import {emptyPrayer, IPrayer} from 'src/types/Prayer'
import api from 'src/services/api'
import {useGetRequest} from '../useGetRequest'
// import {IIntention} from 'src/pages/IntentionPage/Interface'

// const emptyIntention = {
//   description: 'loading...',
//   id: '',
//   title: 'loading...',
//   userId: '',
// }

// export const useIntentionList = () => {
//   const {state} = useGetRequest<IIntention[]>(
//     api,
//     'intentions?order[updated]=desc',
//     [],
//   )
//   const {data: intentions} = state

//   return {intentions}
// }

// TODO GM: change to localstorage
// export const useIntention = (id: string) =>
//   useGetRequest<IIntention>(api, `intentions/${id}`, emptyIntention)

// TODO GM: change to localstorage
export const usePrayer = (id: string | undefined) => {
  const url = id ? `prayers/${id}` : ''
  return useGetRequest<IPrayer>(api, url, emptyPrayer)
}
