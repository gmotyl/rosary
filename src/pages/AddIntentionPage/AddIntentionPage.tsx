import {SyntheticEvent} from 'react'
import {AddIntentionCard} from 'src/components/AddIntentionCard'
import {useHistory} from 'react-router-dom'
import {useIntentions} from 'src/hooks'

export const AddIntentionPage: React.FC = () => {
  let history = useHistory()
  const {saveIntention} = useIntentions()
  const submitIntention = (e: SyntheticEvent) => {
    e.preventDefault()
    const {
      title: {value: title},
      description: {value: description},
    } = e.target['elements']

    saveIntention({id: Date.now().toString(), title, description})
    history.goBack()
  }

  return (
    <>
      <AddIntentionCard onSubmit={submitIntention} />
    </>
  )
}
