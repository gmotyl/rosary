import {IIntention} from 'src/pages/IntentionPage/Interface'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {willCompleteRosary} from 'src/utils/rosaryGroups'
import {pulse, PulseKind} from 'src/tools/haptics'

// Last Hail Mary of a decade; advancing from it completes the decade
const LAST_BEAD = 10

// Actions come from the caller's useIntentions instance: a second instance here
// would keep its own state and the screen would not re-render on navigation
type PrayerActions = {
  prayNext: (intention: IIntention) => void
  prayPrev: (intention: IIntention) => void
}

// Decided from the state BEFORE prayNext is applied
const advancePulseKind = (intention: IIntention): PulseKind => {
  if ((intention.currentBead ?? 0) < LAST_BEAD) return 'bead'
  return willCompleteRosary(intention) ? 'rosary' : 'decade'
}

export const usePrayerNavigation = (
  intention: IIntention,
  {prayNext, prayPrev}: PrayerActions,
) => {
  const isComplete = intention.currentMystery === MysteryTypes.Complete

  const advance = () => {
    if (isComplete) return
    const kind = advancePulseKind(intention)
    prayNext(intention)
    pulse(kind)
  }

  const retreat = () => {
    if ((intention.currentBead ?? 0) <= 0) return
    prayPrev(intention)
    pulse('bead')
  }

  return {advance, retreat, isComplete}
}
