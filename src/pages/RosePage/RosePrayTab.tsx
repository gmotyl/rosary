import {useRef, useState} from 'react'
import {Box, IconButton, Link, Typography} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {Link as RouterLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {getMystery} from 'src/consts/rosary'
import {useRoses} from 'src/hooks'
import {useAdvanceKeys} from 'src/hooks/useAdvanceKeys'
import {pulse} from 'src/tools/haptics'
import {toLocalDate} from 'src/utils/roseChangeDay'
import {RosaryLoop} from 'src/components/RosaryLoop'
import {FishCelebration, monthLocative} from 'src/components/FishCelebration'
import {FishIcon} from 'src/components/Icons'

// Mystery titles read "<ordinal> <group>: <name>"; split them into the short
// label (heading kicker, banner) and the name
export const splitTitle = (title: string) => {
  const idx = title.indexOf(': ')
  return idx >= 0
    ? {label: title.slice(0, idx), name: title.slice(idx + 2)}
    : {label: '', name: title}
}

interface RosePrayTabProps {
  id: string
}

export const RosePrayTab: React.FC<RosePrayTabProps> = ({id}) => {
  const {t} = useTranslation()
  const {getRose, advanceBead, retreatBead, dismissBanner} = useRoses()
  const rose = getRose(id)
  const [celebrating, setCelebrating] = useState(false)
  // Read synchronously by advance: a key that closes the celebration must not
  // also advance a bead, even before the re-render disables the key listener
  const celebratingRef = useRef(false)
  celebratingRef.current = celebrating

  const advance = () => {
    if (celebratingRef.current || !getRose(id)) return
    const {completed} = advanceBead(id)
    pulse(completed ? 'decade' : 'bead')
    if (completed) {
      celebratingRef.current = true
      setCelebrating(true)
    }
  }

  const retreat = () => {
    if ((getRose(id)?.currentBead ?? 0) <= 0) return
    retreatBead(id)
    pulse('bead')
  }

  useAdvanceKeys(advance, !celebrating)

  // RosePage redirects unknown ids; this only covers a rose deleted meanwhile
  if (!rose) return null

  const mystery = getMystery(rose.mystery, t)
  const {label, name} = splitTitle(mystery.title)

  const now = new Date()
  const today = toLocalDate(now)
  const monthPrefix = today.slice(0, 7)
  const prayedThisMonth = rose.prayedDays.filter((d) =>
    d.startsWith(monthPrefix),
  ).length
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate()
  const prayedToday = rose.prayedDays.includes(today)

  return (
    <Box
      data-testid="rose-pray-tab"
      sx={{display: 'flex', flexDirection: 'column', px: 2, pt: 1}}
    >
      {rose.showNewMysteryBanner && (
        <Box
          data-testid="rose-new-mystery-banner"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(195,154,78,0.18)',
            borderRadius: 3,
            pl: 1.5,
            pr: 0.5,
            py: 0.5,
            mb: 1,
            fontSize: 13,
          }}
        >
          <Typography sx={{flex: 1, fontSize: 'inherit'}}>
            {t('rose.pray.newMystery')} <b>{label || name}</b>
          </Typography>
          <Link
            component={RouterLink}
            to={`/rose/${id}/edit`}
            sx={{fontWeight: 700, fontSize: 'inherit'}}
          >
            {t('rose.pray.change')}
          </Link>
          <IconButton
            size="small"
            aria-label={t('rose.pray.dismiss')}
            onClick={() => dismissBanner(id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box
        data-testid="rose-mystery-heading"
        sx={{textAlign: 'center', mt: 1, mb: 0.5}}
      >
        {label && (
          <Typography
            sx={{
              fontSize: 12,
              color: 'secondary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 700,
            }}
          >
            {label}
          </Typography>
        )}
        <Typography
          component="h2"
          sx={{fontFamily: 'Georgia,serif', fontSize: 21, fontWeight: 600}}
        >
          {name}
        </Typography>
        <Typography sx={{fontSize: 11, color: 'text.secondary'}}>
          {t('rose.pray.yourMystery')}
        </Typography>
      </Box>

      <RosaryLoop
        imageSrc={mystery.image}
        currentBead={rose.currentBead}
        currentMystery={rose.mystery}
        onAdvance={advance}
        onRetreat={retreat}
      />

      <Typography
        data-testid="rose-today-status"
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          fontSize: 13,
          color: 'text.secondary',
        }}
      >
        <FishIcon filled={prayedToday} width={22} height={15} />
        {t(prayedToday ? 'rose.pray.todayPrayed' : 'rose.pray.todayNotPrayed')}
      </Typography>

      <FishCelebration
        open={celebrating}
        prayed={prayedThisMonth}
        daysInMonth={daysInMonth}
        monthLabel={monthLocative(now.getMonth(), t)}
        onClose={() => setCelebrating(false)}
      />
    </Box>
  )
}

export default RosePrayTab
