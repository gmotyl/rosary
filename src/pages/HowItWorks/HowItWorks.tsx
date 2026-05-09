import {FC} from 'react'
import {Card, CardContent, CardMedia, Container} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useTranslation} from 'react-i18next'

import {Title, Paragraph} from 'src/components/UI/Atoms'
import {About} from '../About'

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

export const HowItWorks: FC = () => {
  const classes = useStyles()
  const {t} = useTranslation()

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="/img/rosary2.jpeg"
          title={t('howItWorks.title')}
        />
        <CardContent className={classes.cardContent}>
          <Title>{t('howItWorks.title')}</Title>
          <Paragraph>{t('howItWorks.intro')}</Paragraph>
          <Paragraph>1. {t('howItWorks.step1')}</Paragraph>
          <Paragraph>2. {t('howItWorks.step2')}</Paragraph>
          <Paragraph>3. {t('howItWorks.step3')}</Paragraph>
          <Paragraph>{t('howItWorks.offlineNote')}</Paragraph>
        </CardContent>
      </Card>
      <About />
    </Container>
  )
}
