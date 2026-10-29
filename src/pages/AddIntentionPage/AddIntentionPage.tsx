import {FormEvent} from 'react'
import {AddIntentionCard} from 'src/components/AddIntentionCard'
import {useHistory} from 'react-router-dom'
import {useIntentions} from 'src/hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'

export const AddIntentionPage: React.FC = () => {
  const history = useHistory()
  const {saveIntention} = useIntentions()
  const submitIntention = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {elements} = e.currentTarget
    const title = (elements.namedItem('title') as HTMLTextAreaElement).value
    const description = (elements.namedItem('description') as HTMLTextAreaElement)
      .value

    saveIntention({
      id: Date.now().toString(),
      title,
      description,
      currentMystery: MysteryTypes.Joyful1,
    })
    history.goBack()
  }

  return (
    <>
      <AddIntentionCard onSubmit={submitIntention} />
    </>
  )
}
