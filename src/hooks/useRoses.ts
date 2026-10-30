import {useRef, useState} from 'react'
import {useLocalStorage} from 'react-use'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {
  ChangeDay,
  advanceMystery,
  changeDatesBetween,
  latestChangeDateOnOrBefore,
  toLocalDate,
} from 'src/utils/roseChangeDay'

export interface IRose {
  id: string
  name: string
  mystery: MysteryTypes
  changeDay: ChangeDay
  lastChange: string // 'YYYY-MM-DD', most recent change date applied
  prayedDays: string[] // 'YYYY-MM-DD' local dates with a completed decade
  showNewMysteryBanner: boolean
  currentBead: number
}

export const ROSES_KEY = 'rosary-roses'

// Same single-decade bead model as useIntentions / RosaryLoop:
//   currentBead = 0     → Our Father active
//   currentBead = 1..10 → Hail Mary 1..10 active
//   advance from 10     → decade completed, back to 0
const LAST_BEAD = 10

type RoseInput = {name: string; mystery: MysteryTypes; changeDay: ChangeDay}
type RosePatch = Partial<Pick<IRose, 'name' | 'mystery' | 'changeDay'>>

const today = (): string => toLocalDate(new Date())

// Unique within one tick too (Date.now alone collides on rapid adds)
const newId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const useRoses = () => {
  const [stored, saveStored] = useLocalStorage<IRose[]>(ROSES_KEY, [])
  const [roses, setRoses] = useState<IRose[]>(
    Array.isArray(stored) ? stored : [],
  )
  // Latest list, read synchronously so several mutations in one tick
  // (and advanceBead's return value) never work on a stale snapshot
  const latest = useRef(roses)

  const commit = (next: IRose[]) => {
    latest.current = next
    setRoses(next)
    saveStored(next)
  }

  const updateOne = (id: string, fn: (rose: IRose) => IRose) => {
    const list = latest.current
    if (!list.some((r) => r.id === id)) return
    commit(list.map((r) => (r.id === id ? fn(r) : r)))
  }

  const getRose = (id: string) => latest.current.find((r) => r.id === id)

  const addRose = (input: RoseInput): IRose => {
    const rose: IRose = {
      id: newId(),
      name: input.name.trim(),
      mystery: input.mystery,
      changeDay: input.changeDay,
      lastChange: latestChangeDateOnOrBefore(input.changeDay, today()),
      prayedDays: [],
      showNewMysteryBanner: false,
      currentBead: 0,
    }
    commit([...latest.current, rose])
    return rose
  }

  const updateRose = (id: string, patch: RosePatch) =>
    updateOne(id, (rose) => ({
      ...rose,
      ...(patch.name !== undefined && {name: patch.name.trim()}),
      ...(patch.mystery !== undefined && {mystery: patch.mystery}),
      ...(patch.changeDay !== undefined && {
        changeDay: patch.changeDay,
        lastChange: latestChangeDateOnOrBefore(patch.changeDay, today()),
      }),
    }))

  const deleteRose = (id: string) =>
    commit(latest.current.filter((r) => r.id !== id))

  const applyChangeDays = (id: string, day: string = today()) => {
    const rose = latest.current.find((r) => r.id === id)
    if (!rose) return
    const dates = changeDatesBetween(rose.changeDay, rose.lastChange, day)
    if (dates.length === 0) return
    updateOne(id, (r) => ({
      ...r,
      mystery: advanceMystery(r.mystery, dates.length),
      lastChange: dates[dates.length - 1],
      showNewMysteryBanner: true,
      currentBead: 0,
    }))
  }

  const toggleDay = (id: string, date: string) =>
    updateOne(id, (rose) => ({
      ...rose,
      prayedDays: rose.prayedDays.includes(date)
        ? rose.prayedDays.filter((d) => d !== date)
        : [...rose.prayedDays, date],
    }))

  const advanceBead = (id: string): {completed: boolean} => {
    const rose = latest.current.find((r) => r.id === id)
    if (!rose) return {completed: false}
    if (rose.currentBead < LAST_BEAD) {
      updateOne(id, (r) => ({...r, currentBead: r.currentBead + 1}))
      return {completed: false}
    }
    const day = today()
    updateOne(id, (r) => ({
      ...r,
      currentBead: 0,
      showNewMysteryBanner: false,
      prayedDays: r.prayedDays.includes(day)
        ? r.prayedDays
        : [...r.prayedDays, day],
    }))
    return {completed: true}
  }

  const retreatBead = (id: string) =>
    updateOne(id, (rose) =>
      rose.currentBead > 0
        ? {...rose, currentBead: rose.currentBead - 1}
        : rose,
    )

  const dismissBanner = (id: string) =>
    updateOne(id, (rose) => ({...rose, showNewMysteryBanner: false}))

  return {
    roses,
    getRose,
    addRose,
    updateRose,
    deleteRose,
    applyChangeDays,
    toggleDay,
    advanceBead,
    retreatBead,
    dismissBanner,
  }
}
