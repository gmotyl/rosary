import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import {makeStyles} from '@mui/styles'
import {Paragraph, Title} from 'src/components/UI/Atoms'

const useStyles = makeStyles((theme) => ({
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
    paddingTop: '26.25%', // 16:9
  },
}))

const PrayDisclaimerCard: React.ComponentType<{}> = () => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image="/img/rosary2.jpeg"
        title="How it works"
      />
      <CardContent className={classes.cardContent}>
        <Title>Jak się modlić ?</Title>
        <Paragraph>
          Gdy klikniesz "Pobierz tajemnicę" system zarezerwuje dla Ciebie
          kolejną tajemnicę różańca, który wspólnota odmawia w danej intencji.
          Odmów dziesiątek różańca rozważając w sercu tajemnicę, która się
          wyświetliła a ustnie mówiąc modlitwy (1xOjcze Nasz, 10xZdrowaś Maryjo,
          1xChwała Ojcu, 1xO mój Jezu), następnie kliknij "GOTOWE" aby zapisać
          postęp modlitwy w tej intencji.
        </Paragraph>
        <Title>Po co system rezerwuje (blokuje) tajemnicę na 10 min ?</Title>
        <Paragraph>
          W danej intencji może się modlić wiele osób jednocześnie. Nawet gdy
          kilka osób kliknie w tym samym momencie "Pobierz tajemnicę", każdy
          otrzyma inną tajemnicę do rozważania na modlitwie. W efekcie modlitwy
          zawiązanej tak wspólnoty łączą się w jeden różaniec (na podobnej
          zasadzie działają Róże Różańcowe).
        </Paragraph>
        <Title>
          Co się stanie gdy nie skończę modlitwy lub nie zapiszę jej?
        </Title>
        <Paragraph>
          Gdy 10 min rezerwacji tajemnicy upłynie i nikt nie potwierdzi, że
          odmówił dziesiątek różańca związany z daną tajemnicą to zostanie ona
          przez system przekazana następnej osobie, która kliknie "pobierz
          tajemnicę".
        </Paragraph>
      </CardContent>
    </Card>
  )
}

export default PrayDisclaimerCard
