import dayjs, {Dayjs} from 'dayjs'
import {createContext, PropsWithChildren, useState} from 'react'
import {MysteryTypes} from 'src/consts/MysteryTypes'
import {IPrayRequest} from 'src/hooks/useRosaryApi/usePrayRosaryRequest'
import {getObject, setObject} from 'src/tools/repository'
import {entities} from 'src/consts/entities'
import {FC} from 'react'

type TActivePrayerData = IPrayRequest & {intentionId: string}

type TActivePrayer = {
  isPrayerActive: () => boolean
  start: Dayjs
  data: TActivePrayerData
  setIsPrayerActive: (value: boolean) => void
  setActivePrayerData: (value: TActivePrayerData) => void
}
interface IUIContext {
  loginRedirect: string
  setLoginRedirect: (value: string) => void
  activePrayer: TActivePrayer
}

export const emptyPrayerData = {
  prayer: '',
  rosary: '',
  intentionId: '',
  type: MysteryTypes.none,
}

const emptyActivePrayer: TActivePrayer = {
  isPrayerActive: () => false,
  start: dayjs('1979-07-15'),
  data: emptyPrayerData,
  setIsPrayerActive: (value: boolean) => console.error(MISSUSE_MESSAGE),
  setActivePrayerData: (value: TActivePrayerData) =>
    console.error(MISSUSE_MESSAGE),
}
const MISSUSE_MESSAGE =
  'You attempt to use UIContext but forgot to wrap component in UIStateProvider!'
export const defaultValue = {
  loginRedirect: '/',
  setLoginRedirect: (value: string) => console.error(MISSUSE_MESSAGE),
  activePrayer: emptyActivePrayer,
}

export const UIContext = createContext<IUIContext>(defaultValue)

export const UIStateProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [loginRedirect, setLoginRedirect] = useState(defaultValue.loginRedirect)
  const [prayerStart, setPrayerStart] = useState(getDefaultPrayerStartTime())
  const [activePrayerData, setActivePrayerData] = useState(
    getDefaultPrayerData(),
  )

  const setIsActive = (active: boolean) => {
    console.log('setIsActive', Math.random(), active)
    if (active) {
      setPrayerStart(dayjs())
      setObject(entities.PRAYER_START, dayjs())
    } else {
      setPrayerStart(dayjs('1979-07-15'))
      setObject(entities.PRAYER_START, dayjs('1979-07-15'))
    }
  }

  const isActive = () => {
    const seconds = dayjs().diff(prayerStart, 'second')
    return seconds <= 10 * 60
  }

  const activePrayer: TActivePrayer = {
    isPrayerActive: isActive,
    start: prayerStart,
    setIsPrayerActive: setIsActive,
    data: activePrayerData,
    setActivePrayerData: (value: TActivePrayerData) => {
      setActivePrayerData(value)
      setObject(entities.PRAYER, value)
    },
  }

  const value = {
    loginRedirect,
    setLoginRedirect,
    activePrayer,
  }
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

const getDefaultPrayerData = () => getObject(entities.PRAYER, emptyPrayerData)
const getDefaultPrayerStartTime = () =>
  getObject(entities.PRAYER_START, dayjs('1979-07-15'))
