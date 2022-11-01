import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export function LinearProgressWithLabel(
  props: LinearProgressProps & {label: string},
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  )
}
