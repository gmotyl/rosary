import {Avatar, Box, ButtonBase} from '@mui/material'
import {keyframes} from '@emotion/react'
import {useEffect, useRef, useState} from 'react'

const SLOT_COUNT = 13 // 11 beads + 2 visual gaps
const SLOT_ANGLE = (2 * Math.PI) / SLOT_COUNT
const STAGE_SIZE = 320
const RING_RADIUS = 130
const HM_BEAD_SIZE = 22
const OF_BEAD_SIZE = 30
const IMAGE_SIZE = 200
const TRANSITION = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)'

// Slot 0 = OF, slot 1 = gap (between OF and HM1),
// slots 2..11 = HM1..HM10, slot 12 = gap (between HM10 and OF — "Glory Be" position).
const slotForBead = (beadIndex: number): number => (beadIndex === 0 ? 0 : beadIndex + 1)

// Slot 0 sits at the top (-π/2). Active bead lands at the bottom (+π/2).
const baseAngle = (slot: number) => -Math.PI / 2 + slot * SLOT_ANGLE
const rotationForActive = (activeSlot: number) => Math.PI / 2 - baseAngle(activeSlot)

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 4px rgba(136, 14, 79, 0.25);
  }
  50% {
    transform: scale(1.18);
    box-shadow: 0 0 0 8px rgba(136, 14, 79, 0.12);
  }
`

interface RosaryLoopProps {
  imageSrc: string
  currentBead: number
  currentMystery: number
  onAdvance: () => void
  onRetreat: () => void
}

export const RosaryLoop: React.FC<RosaryLoopProps> = ({
  imageSrc,
  currentBead,
  currentMystery,
  onAdvance,
  onRetreat,
}) => {
  const activeSlot = slotForBead(currentBead)

  // Cumulative rotation grows/shrinks unbounded so CSS interpolates the path
  // we choose (forward through the gap, backward, or snap on jump).
  const [rotation, setRotation] = useState(() => rotationForActive(activeSlot))
  const [transitionsOn, setTransitionsOn] = useState(true)
  const [imageOpacity, setImageOpacity] = useState(1)
  const [displayedSrc, setDisplayedSrc] = useState(imageSrc)
  const prevBeadRef = useRef(currentBead)
  const prevMysteryRef = useRef(currentMystery)

  useEffect(() => {
    const prevBead = prevBeadRef.current
    const prevMystery = prevMysteryRef.current
    if (prevBead === currentBead && prevMystery === currentMystery) return

    const mysteryChanged = prevMystery !== currentMystery
    const beadDelta = currentBead - prevBead

    if (!mysteryChanged && beadDelta === 1) {
      setRotation((r) => r - SLOT_ANGLE)
    } else if (!mysteryChanged && beadDelta === -1) {
      setRotation((r) => r + SLOT_ANGLE)
    } else if (mysteryChanged && prevBead === 10 && currentBead === 0) {
      setRotation((r) => r - 2 * SLOT_ANGLE)
    } else {
      setTransitionsOn(false)
      setRotation(rotationForActive(slotForBead(currentBead)))
      const id = requestAnimationFrame(() => setTransitionsOn(true))
      return () => cancelAnimationFrame(id)
    }

    prevBeadRef.current = currentBead
    prevMysteryRef.current = currentMystery
  }, [currentBead, currentMystery])

  useEffect(() => {
    if (imageSrc === displayedSrc) return
    setImageOpacity(0)
    const t = setTimeout(() => {
      setDisplayedSrc(imageSrc)
      setImageOpacity(1)
    }, 200)
    return () => clearTimeout(t)
  }, [imageSrc, displayedSrc])

  return (
    <Box
      sx={{
        position: 'relative',
        width: STAGE_SIZE,
        height: STAGE_SIZE,
        mx: 'auto',
        userSelect: 'none',
      }}
      data-testid="rosary-loop"
    >
      <Box
        onClick={onAdvance}
        data-testid="rosary-image"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          marginLeft: `-${IMAGE_SIZE / 2}px`,
          marginTop: `-${IMAGE_SIZE / 2}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: 4,
          cursor: 'pointer',
          opacity: imageOpacity,
          transition: 'opacity 200ms ease-in-out',
        }}
      >
        <Avatar
          src={displayedSrc}
          alt=""
          sx={{width: '100%', height: '100%'}}
        />
      </Box>

      <Box
        data-testid="bead-rotator"
        sx={{
          position: 'absolute',
          inset: 0,
          transform: `rotate(${rotation}rad)`,
          transition: transitionsOn ? TRANSITION : 'none',
          pointerEvents: 'none',
        }}
      >
        {Array.from({length: 11}, (_, beadIndex) => {
          const slot = slotForBead(beadIndex)
          const angle = baseAngle(slot)
          const cx = STAGE_SIZE / 2
          const cy = STAGE_SIZE / 2
          const x = cx + Math.cos(angle) * RING_RADIUS
          const y = cy + Math.sin(angle) * RING_RADIUS
          const size = beadIndex === 0 ? OF_BEAD_SIZE : HM_BEAD_SIZE

          const isActive = beadIndex === currentBead
          const isPast = beadIndex < currentBead
          const isNext = beadIndex === currentBead + 1
          const isPrev = beadIndex === currentBead - 1
          const clickable = isNext || isPrev

          const onClick = isNext ? onAdvance : isPrev ? onRetreat : undefined
          const state = isActive ? 'active' : isPast ? 'past' : 'future'

          return (
            <Box
              key={beadIndex}
              data-testid={`bead-${beadIndex}`}
              data-state={state}
              data-bead-kind={beadIndex === 0 ? 'of' : 'hm'}
              sx={{
                position: 'absolute',
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
              }}
            >
              <ButtonBase
                disabled={!clickable}
                onClick={onClick}
                focusRipple
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  backgroundColor: isPast || isActive ? 'primary.main' : 'background.paper',
                  pointerEvents: clickable ? 'auto' : 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  animation: isActive ? `${pulse} 1.4s ease-in-out infinite` : 'none',
                  boxShadow: isActive ? '0 0 0 4px rgba(136, 14, 79, 0.25)' : 'none',
                }}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
