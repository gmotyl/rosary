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
    let timer: number | undefined
    const schedule = () => {
      window.clearTimeout(timer)
      // A second past midnight, so a slightly early timer still lands on it
      timer = window.setTimeout(() => {
        refresh()
        schedule()
      }, msUntilNextMidnight(new Date()) + 1000)
    }
    // A clock or time zone change while asleep leaves the pending timer
    // aimed at the old midnight, so re-arm it on every resume
    const resume = () => {
      refresh()
      schedule()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') resume()
    }

    schedule()
    // The day may have changed between the first render and this effect
    refresh()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', resume)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', resume)
    }
  }, [])

  return today
}
