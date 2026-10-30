import {useEffect} from 'react'
import {BottomNavigation, BottomNavigationAction, Box} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditIcon from '@mui/icons-material/Edit'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {ERoutes} from 'src/app/config/routes'
import {useRoses} from 'src/hooks'
import {RosePrayTab} from './RosePrayTab'

type RoseTab = 'pray' | 'calendar' | 'edit'

// Visual order of the bottom bar: Modlitwa, Kalendarz, Zmień
const TABS: {tab: RoseTab; icon: JSX.Element}[] = [
  {tab: 'pray', icon: <RadioButtonCheckedIcon />},
  {tab: 'calendar', icon: <CalendarMonthIcon />},
  {tab: 'edit', icon: <EditIcon />},
]

const rosePath = (id: string, tab: RoseTab) => `/rose/${id}/${tab}`

// Placeholder bodies; later tasks swap them for RoseCalendarTab, RoseEditTab
const TabPlaceholder = ({tab}: {tab: RoseTab}) => (
  <Box data-testid={`rose-${tab}-tab`} />
)

export const RosePage = () => {
  const {id} = useParams<{id: string}>()
  const {pathname} = useLocation()
  const {t} = useTranslation()
  const {getRose, applyChangeDays} = useRoses()
  const rose = getRose(id)

  // Catch up on change dates that passed since the last visit, once per rose
  useEffect(() => {
    applyChangeDays(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!rose) return <Redirect to={ERoutes.HOME} />

  const active = TABS.find(({tab}) =>
    pathname.startsWith(rosePath(id, tab)),
  )?.tab

  return (
    <>
      <Box sx={{pb: 8}}>
        <Switch>
          {TABS.map(({tab}) => (
            <Route key={tab} path={`${ERoutes.ROSE}/${tab}`}>
              {tab === 'pray' ? (
                <RosePrayTab id={id} />
              ) : (
                <TabPlaceholder tab={tab} />
              )}
            </Route>
          ))}
          <Redirect to={rosePath(id, 'pray')} />
        </Switch>
      </Box>

      <BottomNavigation
        data-testid="rose-bottom-nav"
        showLabels
        value={active ?? false}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {TABS.map(({tab, icon}) => (
          <BottomNavigationAction
            key={tab}
            value={tab}
            data-testid={`rose-${tab}-tab-nav`}
            label={t(`rose.tabs.${tab}`)}
            icon={icon}
            component={Link}
            to={rosePath(id, tab)}
          />
        ))}
      </BottomNavigation>
    </>
  )
}

export default RosePage
