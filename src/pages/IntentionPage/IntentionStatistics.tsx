import dayjs, {Dayjs} from 'dayjs'
import React, {FC, useEffect, useState} from 'react'
import {IntentionStatisticCard} from 'src/components/IntentionStatisticCard'
import {UIContext} from 'src/context/UIStateProvider'

interface IntentionStatisticProps {
  rosaryCount: number
  prayFinished: number
  prayInProgress: number
  intentionId: string
  updateStats: () => void
}

const diffInSecounds = (start: Dayjs) => {
  const diff = 600 - dayjs().diff(start, 'second')
  return diff > 0 ? diff : 0
}

export const IntentionStatistic: FC<IntentionStatisticProps> = ({
  rosaryCount,
  prayFinished,
  prayInProgress,
  intentionId,
  updateStats,
}) => {
  const {
    activePrayer: {
      start,
      data: {intentionId: activeIntentionId},
    },
  } = React.useContext(UIContext)
  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(diffInSecounds(start))
    }, 1000)

    if (diffInSecounds(start) === 0) {
      clearInterval(timer)
    }

    return () => {
      clearInterval(timer)
    }
  }, [start, setTimeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      updateStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  return (
    <IntentionStatisticCard
      rosaryCount={rosaryCount}
      prayFinished={prayFinished}
      prayInProgress={prayInProgress}
      timeLeft={intentionId === activeIntentionId ? timeLeft : 0}
    />
  )
}
