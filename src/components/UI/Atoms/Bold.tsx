import React, {FC} from 'react'
import {Box} from '@mui/material'

export const Bold: FC = ({children}) => (
  <Box component="span" color="primary.main" fontWeight="bold">
    {children}
  </Box>
)
