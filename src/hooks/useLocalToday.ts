import {useEffect, useState} from 'react'
import {toLocalDate} from 'src/utils/roseChangeDay'

const msUntilNextMidnight = (now: Date) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
  now.getTime()

// Today's local date ('YYYY-MM-DD') that stays current while a component is
// mounted: a PWA left open overnight re-renders at midnight, and on resume,
// since timers do not run while the app sleeps
export const useLocalToday = (): string => {
  const [today, setToday] = useState(() => toLocalDate(new Date()))

  useEffect(() => {
    // Same string bails out of the re-render
    const refresh = () => setToday(toLocalDate(new Date()))
    let timer: number
    const schedule = () => {
      // A second past midnight, so a slightly early timer still lands on it
      timer = window.setTimeout(() => {
        refresh()
        schedule()
      }, msUntilNextMidnight(new Date()) + 1000)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    schedule()
    // The day may have changed between the first render and this effect
    refresh()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', refresh)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return today
}
