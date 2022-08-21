import {FC, PropsWithChildren} from 'react'
import {Box} from '@mui/material'

export const Bold: FC<PropsWithChildren<{}>> = ({children}) => (
  <Box component="span" color="primary.main" fontWeight="bold">
    {children}
  </Box>
)
