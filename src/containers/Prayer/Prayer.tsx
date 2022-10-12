import {Grid} from '@mui/material'
import dayjs from 'dayjs'

import {useContext, useEffect, useState} from 'react'

import {PrayCard} from 'src/components/PrayCard'
import {getMystery} from '../../consts/rosary'
import {usePrayRosaryRequest, useSavePrayer} from '../../hooks/useRosaryApi'
import {UIContext} from 'src/context/UIStateProvider'
import {IIntention} from 'src/pages/IntentionPage/Interface'

interface PrayerProps {
  intention: IIntention
  prayerId: string
  updateStats: () => void
}

export const Prayer: React.ComponentType<PrayerProps> = ({
  prayerId,
  intention,
  updateStats,
}) => {
  const {
    activePrayer: {
      isPrayerActive,
      setIsPrayerActive,
      setActivePrayerData,
      data: {type, intentionId, rosary, prayer},
    },
  } = useContext(UIContext)
  const isInContextPrayer = isPrayerActive() && intentionId === intention.id

  const prayRequest = usePrayRosaryRequest()
  const {prayRequestSuccess, isPrayRequestLoading} = prayRequest
  const {
    state: {isLoading: isSavePrayerPending},
    doRequest: savePrayerRequest,
  } = useSavePrayer()
  const [isPraying, setIsPraying] = useState(isInContextPrayer)
  const prayRequestAction = () => {
    prayRequest.doPrayRequest({intention: `intentions/${intention.id}`}, '')
    setIsPraying(true)
    setIsPrayerActive(true)
    updateStats()
  }
  const prayAction = () => {
    setIsPraying(false)
    setIsPrayerActive(false)
    const payload = {
      id: prayerId,
      rosary,
      type,
      date: dayjs().toJSON(),
      lockDate: null,
    }
    savePrayerRequest(payload, prayer)
    updateStats()
  }
  useEffect(() => {
    if (prayRequestSuccess) {
      setIsPrayerActive(true)
      setActivePrayerData({
        prayer: prayRequest.prayer,
        rosary: prayRequest.rosary,
        type: prayRequest.type,
        intentionId: intention.id,
      })
    }
  }, [prayRequestSuccess])

  const mystery = isPrayRequestLoading
    ? getMystery(0)
    : getMystery(type ? type : prayRequest.type)

  return (
    <Grid container={true} spacing={2}>
      <PrayCard
        mystery={mystery}
        getPrayerButtonDisabled={isPraying || isSavePrayerPending}
        savePrayerButtonDisabled={!isPraying || isPrayRequestLoading}
        onPrayAction={prayAction}
        onPrayRequestAction={prayRequestAction}
        isLoading={isPrayRequestLoading}
      />
    </Grid>
  )
}
