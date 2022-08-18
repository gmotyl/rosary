import React, {FC} from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  makeStyles,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'

import {Bold, Title, Paragraph} from 'src/components/UI/Atoms'
import {About} from '../About'

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
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
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}))

export const HowItWorks: FC = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="/img/rosary2.jpeg"
          title="How it works"
        />
        <CardContent className={classes.cardContent}>
          <Title>Jak to działa ?</Title>
          <Paragraph>
            Orareprome to serwis, który z jednej strony{' '}
            <Bold>łączy Twoją modlitwę z intencjami osób potrzebujących</Bold> a
            z drugiej <Bold>daje Ci wsparcie</Bold> modlitwy różańcowej
            wspólnoty. To od Ciebie zależy jak będziesz korzystać z serwisu.
            Możesz ofiarować swój czas na modlitwę w jednej z intencji i/lub
            poprosić o wsparcie w swojej.
          </Paragraph>
          <Paragraph>
            Unikalną cechą Orareprome jest automatyczne tworzenie wirtualnej
            wspólnoty wokół każdej z intencji. Każda z osób, która zechce
            poświęcić swój czas na modlitwę łączy się w jeden{' '}
            <Bold>wirtualny różaniec w danej intencji</Bold> , ponieważ system
            każdemu przydzieli inną (kolejną) tajemnicę różańca. Na podobnej
            zasadzie jak działają{' '}
            <Bold>
              Róże Różańcowe, lecz zmiana tajemnicy następuje automatycznie
            </Bold>{' '}
            po każdorazowym kliknięciu przycisku "Pobierz tajemnicę". W ten
            sposób teoretycznie jeśli 20 osób w tym samym czasie zacznie
            modlitwę, to każdej z nich system zarezerwuje inną tajemnicę różańca
            świętego i w czasie potrzebnym na odmówienie jednego dziesiątka
            osoby te odmówią cały różaniec. Jeśli modliła by się jedna osoba
            otrzymywała by kolejne tajemnice do rozważań na modlitwie.
            Ostatecznie nie jest istotne ile osób się modli, lecz że mogą na tą
            krótką chwilę{' '}
            <Bold>
              stworzyć małą wspólnotę i razem z przedstawić Panu Bogu tą
              intencję
            </Bold>
            .
          </Paragraph>
          <Paragraph>
            <Bold>Nie musisz się logować aby rozpocząć modlitwę.</Bold> Choć
            intencje są publikowane anonimowo, to musisz się zalogować jeśli
            chcesz dodać swoją. Planujemy bowiem w przyszłości rozbudowę systemu
            o nowe funkcjonalności takie jak np. możliwość podzielenia się
            świadectwem, gdy np. modlitwa w Twojej intencji została wysłuchana.
          </Paragraph>
          <Box display="flex" justifyContent="center">
            <Avatar
              alt="Remy Sharp"
              src="/img/pray1.png"
              className={classes.avatar}
            />
          </Box>
          <Title>
            Mam kilka wolnych minut i <Bold>chcę ofiarować swoją modlitwę</Bold>{' '}
            w czyjejś intencji.
          </Title>
          <Paragraph>
            1. Otwórz aplikację i odszukaj intencję, w której chcesz się modlić.
          </Paragraph>
          <Paragraph>
            2. Gdy klikniesz "Pobierz tajemnicę" system zarezerwuje dla Ciebie
            kolejną tajemnicę różańca, który wspólnota odmawia w danej intencji.
          </Paragraph>
          <Paragraph>
            3. Odmów dziesiątek różańca rozważając w sercu tajemnicę, która się
            wyświetliła a ustnie mówiąc modlitwy (1xOjcze Nasz, 10xZdrowaś
            Maryjo, 1xChwała Ojcu, 1xO mój Jezu)
          </Paragraph>
          <Paragraph>
            4. Po modlitwie kliknij "GOTOWE" aby zapisać postęp modlitwy w tej
            intencji.
          </Paragraph>
          <Paragraph>
            5. Możesz kontynuować modlitwę. Gdy ponownie klikniesz "Pobierz
            tajemnicę" system znajdzie kolejny "wolny" dziesiątek różańca w
            danej intencji. Gdy cały różaniec zostanie odmówiony System
            rezerwuje automatycznie pierwszą tajemnicę z kolejnego różańca.
            (wkrótce będzie możliwość wyświetlenia statystyki odmówionych
            modlitw)
          </Paragraph>
          <Box display="flex" justifyContent="center">
            <Avatar
              alt="Remy Sharp"
              src="/img/pray2.png"
              className={classes.avatar}
            />
          </Box>
          <Title>
            Mam intencję, w której <Bold>potrzebuję wsparcia modlitewnego</Bold>{' '}
            wspólnoty.
          </Title>
          <Paragraph>
            <Bold>Pamiętaj że nie jesteś sam(a)</Bold> towarzyszy Ci{' '}
            <Bold>Jezus Chrystus, Bóg</Bold>, który dla Ciebie stał się
            człowiekiem, umarł na krzyżu i zmartwychwstał! Podziel się swoją
            intencją i bądź pewny(a), że wraz z Tobą będziemy ją przedstawiać
            Panu, prosząc by w Twoi życiu zawsze realizowała się Jego dobroć i
            wola.{' '}
          </Paragraph>
          <Paragraph>
            1. Kliknij "dodaj intencję" (na stronie głównej lub w menu bocznym)
          </Paragraph>
          <Paragraph>
            2. Jeśli nie jesteś zalogowany to system Cię o to poprosi, w tym
            kroku można również zarejestrować nowe konto
          </Paragraph>
          <Paragraph>
            3. Wypełnij prosty formularz z tytułem intencji i krótkim opisem.
            Gotowe!
          </Paragraph>
          <Paragraph>
            4. Gotowe! Twoja intencja zostanie (anonimowo) opublikowana w
            serwisie.{' '}
          </Paragraph>
          <Paragraph>
            W przyszłości planujemy funkcję moderowania zgłaszanych intencji.
            Obecnie administrator przegląda okresowo nowe intencje. Wpisy
            obraźliwe, ewidentne duplikaty lub inne intencje nie zgodne z duchem
            serwisu mogą zostać usunięte.{' '}
          </Paragraph>
        </CardContent>
      </Card>
      <About />
    </Container>
  )
}
