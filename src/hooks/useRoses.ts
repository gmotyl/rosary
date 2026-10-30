import {useSyncExternalStore} from 'react'
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

// One shared store for every useRoses() instance: Header, SideMenu and
// RosePage are mounted together, so per-instance state would go stale and
// overwrite each other's writes. localStorage is the source of truth; the
// parsed list is cached by its raw string so the snapshot stays referentially
// stable between writes (required by useSyncExternalStore).
const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cachedList: IRose[] = []

const parse = (raw: string | null): IRose[] => {
  if (raw === null) return []
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? (value as IRose[]) : []
  } catch {
    return []
  }
}

// undefined = storage unreadable (blocked site data throws SecurityError on
// access); callers then keep the in-memory list instead of crashing the
// render, since Header reads roses on every route
const readStoredRaw = (): string | null | undefined => {
  try {
    return localStorage.getItem(ROSES_KEY)
  } catch {
    return undefined
  }
}

const readRoses = (): IRose[] => {
  const raw = readStoredRaw()
  if (raw === undefined) return cachedList
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedList = parse(raw)
  }
  return cachedList
}

const writeRoses = (next: IRose[]) => {
  const raw = JSON.stringify(next)
  try {
    localStorage.setItem(ROSES_KEY, raw)
    cachedRaw = raw
  } catch (error) {
    // Quota or blocked storage: keep the change in memory for this session.
    // Pinning cachedRaw to what storage still holds makes readRoses keep
    // serving `next` until storage really changes (e.g. another tab writes).
    // If that read throws too, keep the last known baseline: dropping it to
    // undefined would make the unchanged persisted value look new once
    // storage recovers, replacing these in-memory changes with stale data.
    console.warn('rosary: could not persist roses', error)
    const stored = readStoredRaw()
    if (stored !== undefined) cachedRaw = stored
  }
  cachedList = next
  listeners.forEach((listener) => listener())
}

// Other tabs write the same key; re-read on their storage events
const onStorage = (event: StorageEvent) => {
  if (event.key === ROSES_KEY || event.key === null) {
    listeners.forEach((listener) => listener())
  }
}

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

export const useRoses = () => {
  const roses = useSyncExternalStore(subscribe, readRoses)

  // Mutations always compute from the store's latest list, never from this
  // render's snapshot, so several calls in one tick (or from different
  // instances) compose instead of overwriting each other
  const updateOne = (id: string, fn: (rose: IRose) => IRose) => {
    const list = readRoses()
    if (!list.some((r) => r.id === id)) return
    writeRoses(list.map((r) => (r.id === id ? fn(r) : r)))
  }

  const getRose = (id: string) => readRoses().find((r) => r.id === id)

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
    writeRoses([...readRoses(), rose])
    return rose
  }

  const updateRose = (id: string, patch: RosePatch) =>
    updateOne(id, (rose) => ({
      ...rose,
      ...(patch.name !== undefined && {name: patch.name.trim()}),
      // A different mystery is a new decade: progress from the old one must
      // not let a single tap complete it
      ...(patch.mystery !== undefined &&
        patch.mystery !== rose.mystery && {
          mystery: patch.mystery,
          currentBead: 0,
        }),
      ...(patch.changeDay !== undefined && {
        changeDay: patch.changeDay,
        lastChange: latestChangeDateOnOrBefore(patch.changeDay, today()),
      }),
    }))

  const deleteRose = (id: string) =>
    writeRoses(readRoses().filter((r) => r.id !== id))

  const applyChangeDays = (id: string, day: string = today()) => {
    const rose = readRoses().find((r) => r.id === id)
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
    const rose = readRoses().find((r) => r.id === id)
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
