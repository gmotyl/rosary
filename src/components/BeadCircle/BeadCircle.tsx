import {Avatar, Box, ButtonBase, Chip} from '@mui/material'
import {useTranslation} from 'react-i18next'

interface BeadCircleProps {
  imageSrc: string
  currentBead: number
  onTapBead: (beadIndex: number) => void
}

const RING_RADIUS = 150
const BEAD_COUNT = 10

const beadStateFor = (index: number, currentBead: number) => {
  if (index <= currentBead) return 'past'
  if (index === currentBead + 1) return 'active'
  return 'future'
}

export const BeadCircle: React.FC<BeadCircleProps> = ({
  imageSrc,
  currentBead,
  onTapBead,
}) => {
  const {t} = useTranslation()

  return (
    <Box
      sx={{
        position: 'relative',
        width: RING_RADIUS * 2 + 60,
        height: RING_RADIUS * 2 + 60,
        mx: 'auto',
      }}
    >
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <Avatar src={imageSrc} alt="" sx={{width: 220, height: 220}} />
      </Box>

      {Array.from({length: BEAD_COUNT}, (_, i) => {
        const beadNumber = i + 1
        const angle = (i / BEAD_COUNT) * 2 * Math.PI - Math.PI / 2
        const x = Math.cos(angle) * RING_RADIUS
        const y = Math.sin(angle) * RING_RADIUS
        const state = beadStateFor(beadNumber, currentBead)
        return (
          <ButtonBase
            key={beadNumber}
            data-testid={`bead-${beadNumber}`}
            data-state={state}
            data-active={state === 'active' ? 'true' : 'false'}
            onClick={() => onTapBead(beadNumber)}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              backgroundColor: state === 'past' ? 'primary.main' : 'transparent',
              boxShadow: state === 'active' ? '0 0 0 4px rgba(136, 14, 79, 0.25)' : undefined,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          />
        )
      })}

      <Chip
        data-testid="marker-our-father"
        label={t('prayer.markerOurFather')}
        size="small"
        sx={{position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)'}}
      />
      <Chip
        data-testid="marker-glory-be"
        label={t('prayer.markerGloryBe')}
        size="small"
        sx={{position: 'absolute', bottom: 0, left: '25%'}}
      />
      <Chip
        data-testid="marker-fatima"
        label={t('prayer.markerFatima')}
        size="small"
        sx={{position: 'absolute', bottom: 0, right: '25%'}}
      />
    </Box>
  )
}
