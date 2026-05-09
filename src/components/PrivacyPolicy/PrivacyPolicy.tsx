import {FC} from 'react'
import {Card, CardContent, CardMedia, Container} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

import {Title, Paragraph} from 'src/components/UI/Atoms'

export const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flexGrow: 2,
  },
  cardMedia: {
    paddingTop: '26.25%',
  },
}))

export const PrivacyPolicy: FC = () => {
  const classes = useStyles()
  const {t} = useTranslation()

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="/img/rosary2.jpeg"
          title={t('privacyPolicy.title')}
        />
        <CardContent className={classes.cardContent}>
          <Title>{t('privacyPolicy.title')}</Title>
          <Paragraph>{t('privacyPolicy.body')}</Paragraph>
        </CardContent>
      </Card>
    </Container>
  )
}
