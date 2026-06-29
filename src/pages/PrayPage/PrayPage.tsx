import {PrayCard} from 'src/components/PrayCard'

const DEFAULT_ID = 'default'

// PrayPage is a thin wrapper: PrayCard owns the prayer screen, the bottom bar
// (Reset / Index) and its dialogs so they all share a single useIntentions
// instance — otherwise the bar's jump/reset would update a separate copy of
// state and the beads would never refresh.
export const PrayPage = () => <PrayCard id={DEFAULT_ID} />
