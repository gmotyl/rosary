import {useState} from 'react'
import {Box, ButtonBase, IconButton, Typography} from '@mui/material'
import type {SxProps, Theme} from '@mui/material/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {useLocalToday, useRoses} from 'src/hooks'
import {changeDateInMonth, toLocalDate} from 'src/utils/roseChangeDay'
import {formatMonthCounter, monthLocative} from 'src/components/FishCelebration'
import {formatChangeDayLong, WEEKDAYS} from 'src/components/AddRoseDialog'
import {FishIcon} from 'src/components/Icons'
import {splitTitle} from './RosePrayTab'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type DayState = 'prayed' | 'unprayed' | 'future'

// Change-day accent: a 2px primary ring drawn inside the cell (box-shadow, so
// it never collides with the secondary focus outline) plus a corner badge.
// The legend swatch reuses both, so the key matches the grid exactly.
const changeRing = (theme: Theme) =>
  `inset 0 0 0 2px ${theme.palette.primary.main}`

const changeBadgeSx = (size: number, offset: number): SxProps<Theme> => ({
  position: 'absolute',
  top: offset,
  right: offset,
  width: size,
  height: size,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  // Halo in the page colour lifts the badge off the ring and the today tint
  boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.default}`,
})

interface RoseCalendarTabProps {
  id: string
}

export const RoseCalendarTab: React.FC<RoseCalendarTabProps> = ({id}) => {
  const {t, i18n} = useTranslation()
  const {getRose, toggleDay} = useRoses()
  const rose = getRose(id)

  // Re-renders at midnight and on resume, so a calendar left open overnight
  // enables the new day and follows it into a new month
  const today = useLocalToday()
  const current = {
    year: Number(today.slice(0, 4)),
    month: Number(today.slice(5, 7)) - 1,
  }
  // Shown month; null follows the current one. Never goes past it.
  const [shown, setShown] = useState<{year: number; month: number} | null>(
    null,
  )

  // RosePage redirects unknown ids; this only covers a rose deleted meanwhile
  if (!rose) return null

  const {year, month} = shown ?? current
  const isCurrentMonth = year === current.year && month === current.month
  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    const next = {year: d.getFullYear(), month: d.getMonth()}
    const backToCurrent =
      next.year === current.year && next.month === current.month
    setShown(backToCurrent ? null : next)
  }

  const lng = i18n.resolvedLanguage ?? i18n.language
  const monthTitle = capitalize(
    new Intl.DateTimeFormat(lng, {month: 'long', year: 'numeric'}).format(
      new Date(year, month, 1),
    ),
  )
  const dayFormat = new Intl.DateTimeFormat(lng, {
    day: 'numeric',
    month: 'long',
  })

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthPrefix = toLocalDate(new Date(year, month, 1)).slice(0, 7)
  const prayed = new Set(rose.prayedDays)
  const prayedInMonth = rose.prayedDays.filter((d) =>
    d.startsWith(monthPrefix),
  ).length
  const changeDate = changeDateInMonth(rose.changeDay, year, month)
  // Monday-first: getDay() 0 (Sunday) becomes column 6
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7
  const prayedToday = prayed.has(today)

  const mystery = getMystery(rose.mystery, t)
  const {label, name} = splitTitle(mystery.title)

  return (
    <Box data-testid="rose-calendar-tab" sx={{px: 1.5, pt: 1.5}}>
      <Box
        data-testid="rose-calendar-today"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.75,
          mb: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 3.5,
          bgcolor: 'background.paper',
        }}
      >
        <FishIcon filled={prayedToday} width={56} height={38} />
        <Box sx={{flex: 1, minWidth: 0}}>
          <Typography sx={{fontSize: 12, color: 'text.secondary'}}>
            {t(
              prayedToday
                ? 'rose.pray.todayPrayed'
                : 'rose.pray.todayNotPrayed',
            )}
          </Typography>
          <Typography
            sx={{fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600}}
          >
            {label || name}
          </Typography>
          {label && (
            <Typography sx={{fontSize: 12, color: 'text.secondary'}}>
              {name}
            </Typography>
          )}
          <Typography
            data-testid="rose-calendar-counter"
            sx={{fontSize: 13, fontWeight: 600, color: 'primary.main'}}
          >
            {formatMonthCounter(
              prayedInMonth,
              daysInMonth,
              monthLocative(month, t),
              t,
            )}
          </Typography>
        </Box>
      </Box>

      <Box
        data-testid="rose-calendar-header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <IconButton
          aria-label={t('rose.calendar.prevMonth')}
          onClick={() => shiftMonth(-1)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          component="h2"
          sx={{fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 600}}
        >
          {monthTitle}
        </Typography>
        <IconButton
          aria-label={t('rose.calendar.nextMonth')}
          disabled={isCurrentMonth}
          onClick={() => shiftMonth(1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        data-testid="rose-calendar-grid"
        sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25}}
      >
        {WEEKDAYS.map((wd) => (
          <Typography
            key={wd}
            data-testid="rose-calendar-dow"
            sx={{
              fontSize: 11,
              textAlign: 'center',
              color: 'text.secondary',
              pb: 0.5,
            }}
          >
            {t(`rose.calendar.weekdayShort.${wd}`)}
          </Typography>
        ))}
        {Array.from({length: leadingBlanks}, (_, i) => (
          <Box key={`blank-${i}`} data-testid="rose-calendar-blank" />
        ))}
        {Array.from({length: daysInMonth}, (_, i) => {
          const dayNum = i + 1
          const date = toLocalDate(new Date(year, month, dayNum))
          const state: DayState =
            date > today ? 'future' : prayed.has(date) ? 'prayed' : 'unprayed'
          const isToday = date === today
          const isChange = date === changeDate
          const accessibleName = [
            dayFormat.format(new Date(year, month, dayNum)),
            state === 'prayed' && t('rose.calendar.prayed'),
            isChange && t('rose.calendar.changeDayMark'),
          ]
            .filter(Boolean)
            .join(', ')

          return (
            <ButtonBase
              key={date}
              aria-label={accessibleName}
              data-state={state}
              data-today={isToday ? 'true' : undefined}
              data-change-day={isChange ? 'true' : undefined}
              disabled={state === 'future'}
              onClick={() => toggleDay(id, date)}
              sx={{
                position: 'relative',
                aspectRatio: '1 / 1.05',
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1px',
                fontSize: 12,
                color: isToday ? 'text.primary' : 'text.secondary',
                fontWeight: isToday ? 700 : 400,
                bgcolor: isToday ? 'rgba(195,154,78,0.22)' : 'transparent',
                boxShadow: isChange ? changeRing : 'none',
                // Dim only the content of a disabled (future) day, so a future
                // change day keeps its ring and badge at full strength
                '&.Mui-disabled > :not([data-testid="rose-calendar-change-dot"])':
                  {opacity: 0.4},
                '&.Mui-focusVisible': {
                  outline: 2,
                  outlineColor: 'secondary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <Box component="span" sx={{lineHeight: 1}}>
                {dayNum}
              </Box>
              {state !== 'future' && (
                <FishIcon filled={state === 'prayed'} width={26} height={18} />
              )}
              {isChange && (
                <Box
                  component="span"
                  data-testid="rose-calendar-change-dot"
                  sx={changeBadgeSx(9, 4)}
                />
              )}
            </ButtonBase>
          )
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.75,
          mt: 1,
          fontSize: 11,
          color: 'text.secondary',
        }}
      >
        <Box
          component="span"
          sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}
        >
          <Box
            component="span"
            data-testid="rose-calendar-legend-change"
            sx={{
              position: 'relative',
              width: 16,
              height: 16,
              borderRadius: '5px',
              boxShadow: changeRing,
            }}
          >
            <Box component="span" sx={changeBadgeSx(6, 2)} />
          </Box>
          {t('rose.calendar.changeDayMark')}
        </Box>
        <span>{t('rose.calendar.tapHint')}</span>
      </Box>

      <Box
        data-testid="rose-calendar-change-card"
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1.5,
          px: 0.5,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          fontSize: 14,
        }}
      >
        <Box>
          <Typography
            component="span"
            sx={{display: 'block', fontSize: 12, color: 'text.secondary'}}
          >
            {t('rose.calendar.changeDay')}
          </Typography>
          <Typography component="span" sx={{fontSize: 14}}>
            {formatChangeDayLong(rose.changeDay, t)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default RoseCalendarTab
