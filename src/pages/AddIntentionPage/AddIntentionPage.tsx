import {SyntheticEvent, useContext, useEffect} from 'react'
import {AddIntentionCard} from 'src/components/AddIntentionCard'
import {usePostIntention} from 'src/hooks/useRosaryApi'
import {AuthContext} from 'src/context/AuthProvider'
import {useHistory} from 'react-router-dom'

export const AddIntentionPage: React.FC = () => {
  let history = useHistory()
  const {authToken} = useContext(AuthContext)
  const {isLoading, success, postIntention} = usePostIntention(authToken)
  const submitIntention = (e: SyntheticEvent) => {
    e.preventDefault()
    const {
      title: {value: title},
      description: {value: description},
    } = e.target['elements']

    postIntention({title, description})
  }

  useEffect(() => {
    success && history.goBack()
  }, [success, history])

  return (
    <>
      <AddIntentionCard onSubmit={submitIntention} />
      {isLoading ? 'saving...' : null}
    </>
  )
}
