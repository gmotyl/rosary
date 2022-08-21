import {FC} from 'react'
import {Avatar} from '@mui/material'
import rosary from 'src/rosary.svg'
import {IconProps} from './index'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  icon: {
    marginRight: theme.spacing(4),
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
  },
  rosaryIcon: {
    width: theme.spacing(2),
  },
  rosaryAvatar: {
    width: theme.spacing(4),
  },
}))

export const RosaryIcon: FC<IconProps> = ({avatar}) => {
  const classes = useStyles()

  return (
    <>
      <Avatar className={avatar ? classes.avatar : classes.icon}>
        <img
          src={rosary}
          className={avatar ? classes.rosaryAvatar : classes.rosaryIcon}
          alt="rosary-icon"
        />
      </Avatar>
    </>
  )
}
