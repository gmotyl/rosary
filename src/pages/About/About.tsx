import {FC} from 'react'
import {Link as MUILink} from '@mui/material'
import Typography from '@mui/material/Typography'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    {new Date().getFullYear()}
    <MUILink color="inherit" href="https://twitter.com/gmotyl">
      {' @gmotyl'}
    </MUILink>{' '}
  </Typography>
)

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(6),
  },
}))

export const About: FC = () => {
  const classes = useStyles()
  const {t} = useTranslation()

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom={true}>
        <a
          href="https://github.com/gmotyl/rosary"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t('about.openSource')}
        </a>
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        {t('about.license')}
      </Typography>
      <Copyright />
    </footer>
  )
}
