import {useState} from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import {useTranslation} from 'react-i18next'

import {PrayCard} from 'src/components/PrayCard'
import {ResetConfirmDialog} from 'src/components/ResetConfirmDialog'
import {MysteryIndexSheet} from 'src/components/MysteryIndexSheet'
import {useIntentions} from 'src/hooks'
import {MysteryTypes} from 'src/consts/MysteryTypes'

const DEFAULT_ID = 'default'

export const PrayPage = () => {
  const {t} = useTranslation()
  const {getIntention, restart, jumpToMystery} = useIntentions()
  const intention = getIntention(DEFAULT_ID)
  const [resetOpen, setResetOpen] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)'}}>
      <Box sx={{flex: 1}}>
        <PrayCard id={DEFAULT_ID} />
      </Box>
      <BottomNavigation showLabels sx={{position: 'sticky', bottom: 0}}>
        <BottomNavigationAction
          data-testid="reset-tab"
          label={t('prayer.resetTab')}
          icon={<RestartAltIcon />}
          onClick={() => setResetOpen(true)}
        />
        <BottomNavigationAction
          data-testid="index-tab"
          label={t('prayer.indexTab')}
          icon={<MenuBookIcon />}
          onClick={() => setIndexOpen(true)}
        />
      </BottomNavigation>
      <ResetConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          restart(intention)
          setResetOpen(false)
        }}
      />
      <MysteryIndexSheet
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        onSelect={(m: MysteryTypes) => jumpToMystery(intention, m)}
      />
    </Box>
  )
}
