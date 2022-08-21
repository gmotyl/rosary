import {FC, PropsWithChildren} from 'react'
import {Typography} from '@mui/material'
import {makeStyles} from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  cardParagraph: {
    paddingBottom: theme.spacing(2),
  },
}))

export const Paragraph: FC<PropsWithChildren<{}>> = ({children}) => {
  const classes = useStyles()

  return <Typography className={classes.cardParagraph}>{children}</Typography>
}
