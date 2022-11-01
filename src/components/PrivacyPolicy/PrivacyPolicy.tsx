import {FC} from 'react'
import {Card, CardContent, CardMedia, Container} from '@mui/material'

import {Title, Paragraph} from 'src/components/UI/Atoms'
import {makeStyles} from '@mui/styles'

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

export const PrivacyPolicy: FC = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="/img/rosary2.jpeg"
          title="Privacy policy"
        />
        <CardContent className={classes.cardContent}>
          <Title>Polityka prywatności</Title>
        </CardContent>
        <CardContent className={classes.cardContent}>
          <Title>A. Wprowadzenie</Title>
          <Paragraph>
            <ol>
              <li>
                Prywatność odwiedzających naszą aplikację internetową jest dla
                nas bardzo ważna i dokładamy wszelkich starań, aby ją chronić.
                Niniejsza polityka wyjaśnia, co robimy z Twoimi danymi
                osobowymi.
              </li>
              <li>
                Nasza aplikacja (strona) internetowa nie korzysta z plików
                cookie.
              </li>
            </ol>
          </Paragraph>
          <Title>B. Zbieranie danych osobowych</Title>
          <Paragraph>
            Następujące rodzaje danych osobowych mogą być gromadzone,
            przechowywane i wykorzystywane:
            <ol>
              <li>
                informacje o komputerze, w tym adres IP, lokalizacja
                geograficzna, typ i wersja przeglądarki oraz system operacyjny;
              </li>
              <li>
                informacje o Twoich wizytach i korzystaniu z tej witryny, w tym
                źródło odesłań, długość wizyty, wyświetlenia stron i ścieżki
                nawigacji w aplikacji;
              </li>
              <li>
                informacje, takie jak adres e-mail, które podajesz podczas
                rejestracji w naszej aplikacji internetowej;
              </li>
              <li>
                informacje, które są generowane podczas korzystania z naszej
                aplikacji internetowej, w tym kiedy, jak często i w jakich
                okolicznościach z niej korzystasz;
              </li>
              <li>
                informacje publikowane na naszej aplikacji internetowej z
                zamiarem opublikowania ich w Internecie, w tym nazwa
                użytkownika, zdjęcia profilowe i treść umieszczanych postów;
              </li>
              <li>
                informacje zawarte we wszelkiej korespondencji przesyłanej do
                nas e-mailem lub za pośrednictwem naszej aplikacji internetowej,
                w tym treści komunikacyjne i metadane;
              </li>
              Zanim ujawnisz nam dane osobowe innej osoby, musisz uzyskać zgodę
              tej osoby na ujawnienie i przetwarzanie tych danych osobowych
              zgodnie z niniejszymi zasadami
            </ol>
          </Paragraph>
          <Title>C. Korzystanie z Twoich danych osobowych</Title>
          <Paragraph>
            Dane osobowe przesłane do nas za pośrednictwem naszej aplikacji
            internetowej będą wykorzystywane do celów określonych w niniejszej
            polityce lub na odpowiednich stronach witryny. Możemy wykorzystywać
            Twoje dane osobowe do celu:
            <ol>
              <li>Administrowania naszą stroną internetową/aplikacją</li>
              <li>
                personalizowania naszej aplikacji internetowej/aplikacji dla
                Ciebie;
              </li>
              <li>
                umożliwienia korzystania z usług dostępnych na naszej aplikacji
                internetowej;
              </li>
              <li>wysyłania powiadomień e-mail, o które prosiłeś;</li>
              <li>
                zajmowania się zapytaniami i skargami składanymi przez Ciebie
                lub dotyczącymi Ciebie w związku z naszą aplikacją internetową;
              </li>
              <li>
                zapewnienia bezpieczeństwa naszej aplikacji internetowej i
                zapobieganie oszustwom;
              </li>
              <li>
                weryfikacji zgodności z warunkami korzystania z naszej aplikacji
                internetowej (w tym monitorowanie prywatnych wiadomości
                wysyłanych za pośrednictwem naszej prywatnej usługi przesyłania
                wiadomości);
              </li>
              <li>innych zastosowań;</li>
            </ol>
            Jeśli prześlesz dane osobowe do publikacji w naszej aplikacji,
            opublikujemy je i wykorzystamy w inny sposób zgodnie z udzieloną nam
            licencją. Twoje ustawienia prywatności mogą być wykorzystane do
            ograniczenia publikacji Twoich informacji na naszej aplikacji
            internetowej i mogą być dostosowane za pomocą kontroli prywatności
            na aplikacji. Nie będziemy bez Twojej wyraźnej zgody przekazywać
            danych osobowych stronom trzecim, lub jakimkolwiek innym związanym z
            nimi stronom trzecim, w celach marketingu bezpośredniego.
          </Paragraph>
          <Title>D. Ujawnianie danych osobowych</Title>
          <Paragraph>
            Możemy ujawniać dane osobowe użytkownika wszelkim naszym
            pracownikom, członkom kadry kierowniczej, przedstawicielom,
            dostawcom lub podwykonawcom, o ile jest to niezbędne do celów
            określonych w niniejszych „Zasadach ochrony prywatności”. Możemy
            ujawniać Twoje dane osobowe:
            <ol>
              <li>w zakresie, w jakim jest to wymagane przepisami prawa;</li>
              <li>
                w związku z trwającymi lub potencjalnymi postępowaniami
                prawnymi;
              </li>
              <li>
                w celu ustanowienia, wyegzekwowania lub obrony naszych praw
                (wliczając w to udostępnienie informacji innym podmiotom w celu
                przeciwdziałania oszustwom);
              </li>
              <li>
                nabywcy (lub potencjalnemu nabywcy) jakiejkolwiek działalności
                lub aktywów, które sprzedajemy (lub rozważamy);
              </li>
              <li>
                wszelkim osobom, które wedle naszej zasadnej opinii mogą
                wystąpić do sądu lub innego właściwego organu o ujawnienie
                takich danych osobowych, jeśli wedle zasadnej rozsądnej opinii,
                istnieje duże prawdopodobieństwo, że taki sąd lub organ nakaże
                ujawnienie takich danych osobowych
              </li>
            </ol>
            Z wyjątkiem postanowień zawartych w niniejszych „Zasadach ochrony
            prywatności” nie będziemy udostępniać osobom trzecim informacji
            dotyczących użytkownika.
          </Paragraph>
          <Title>E. Międzynarodowe transfery danych</Title>
          <Paragraph>
            <ol>
              <li>
                Informacje, które gromadzimy mogą być przechowywane i
                przetwarzane w każdym z krajów, w którym prowadzimy działalność
                i mogą być przesyłane pomiędzy tymi krajami w celu umożliwienia
                wykorzystania informacji zgodnie z niniejszymi „Zasadami ochrony
                prywatności”.
              </li>
              <li>
                Dane osobowe, które publikujesz na naszej aplikacji internetowej
                lub przesyłasz do publikacji na naszej aplikacji internetowej,
                mogą być dostępne za pośrednictwem Internetu na całym świecie.
                Nie możemy zapobiec wykorzystywaniu lub niewłaściwemu
                wykorzystaniu takich informacji przez inne osoby.
              </li>
              <li>
                Wyraźnie zgadzasz się na przekazywanie danych osobowych
                opisanych w tej sekcji E.
              </li>
            </ol>
          </Paragraph>
          <Title>F. Zachowywanie danych osobowych</Title>
          <Paragraph>
            <ol>
              <li>
                W Niniejszej Sekcji F określiliśmy nasze zasady i procedury
                dotyczące zatrzymywania danych, które mają na celu zapewnienie
                przestrzegania naszych zobowiązań prawnych w zakresie
                zachowywania i usuwania danych osobowych.
              </li>
              <li>
                Dane osobowe, które przetwarzamy w dowolnym celu lub celach, nie
                będą przechowywane dłużej niż jest to konieczne do tego celu lub
                tych celów.
              </li>
              <li>
                Niezależnie od innych postanowień niniejszej sekcji G zachowamy
                dokumenty (w tym dokumenty elektroniczne) zawierające dane
                osobowe:
                <ol>
                  <li>
                    w zakresie, w jakim jest to wymagane przepisami prawa;
                  </li>
                  <li>
                    jeśli uważamy, że dokumenty mogą mieć znaczenie dla
                    wszelkich toczących się lub przyszłych postępowań sądowych;
                  </li>
                  <li>
                    w celu ustanowienia, wyegzekwowania lub obrony naszych praw
                    (wliczając w to udostępnienie informacji innym podmiotom w
                    celu przeciwdziałania oszustwom);
                  </li>
                </ol>
              </li>
            </ol>
          </Paragraph>
          <Title>G. Bezpieczeństwo danych osobowych</Title>
          <Paragraph>
            <ol>
              <li>
                Podejmiemy zasadne techniczne i organizacyjne środki ostrożności
                w celu przeciwdziałania utracie, nadużyciu lub zmianie danych
                osobowych użytkownika.
              </li>
              <li>
                Będziemy przechowywać wszystkie dane osobowe, które podasz na
                naszych bezpiecznych serwerach (chronionych hasłem i zaporą).
              </li>
              <li>
                Wszystkie elektroniczne transakcje finansowe zawierane za
                pośrednictwem naszej aplikacji internetowej będą chronione
                technologią szyfrowania.
              </li>
              <li>
                Użytkownik przyjmuje do wiadomości, że transmisja informacji
                przez Internet jest potencjalnie niebezpieczna i bezpieczeństwo
                przesłanych w ten sposób danych nie jest gwarantowane.
              </li>
              <li>
                Jesteś odpowiedzialny za zachowanie poufności hasła używanego do
                uzyskania dostępu do naszej aplikacji internetowej; nie
                poprosimy Cię o podanie hasła (z wyjątkiem sytuacji, gdy
                logujesz się do naszej aplikacji).
              </li>
            </ol>
          </Paragraph>
          <Title>H. Nowelizacja</Title>
          <Paragraph>
            Niniejsze zasady mogą być okresowo aktualizowane poprzez
            zamieszczenie w naszej aplikacji ich nowej wersji. Należy od czasu
            do czasu sprawdzać tę stronę, aby upewnić się, że rozumiesz wszelkie
            zmiany w tych zasadach. Możemy powiadomić Cię o zmianach w
            niniejszej polityce za pośrednictwem poczty elektronicznej lub
            prywatnego systemu przesyłania wiadomości na naszej aplikacji
            internetowej.
          </Paragraph>
          <Title>I. Twoje prawa</Title>
          Użytkownik może zażądać udostępnienia jego danych osobowych, które są
          przechowywane. Udostępnienie takich danych wiąże się z:
          <Paragraph>
            <ol>
              <li>
                dostarczenie odpowiedniego dowodu tożsamości, zazwyczaj
                akceptujemy kserokopię dowodu osobistego/paszportu poświadczoną
                przez notariusza oraz oryginalną kopię rachunku za media z
                aktualnym adresem
              </li>
            </ol>
            Możemy na Twoje żądanie ukrywać dane osobowe, w zakresie dozwolonym
            przez prawo.
          </Paragraph>
          <Title>J. aplikacji Internetowe osób trzecich</Title>
          <Paragraph>
            Nasza strona internetowa zawiera hiperłącza do stron internetowych
            osób trzecich oraz szczegółowe informacje na ich temat. Nie mamy
            kontroli i nie ponosimy odpowiedzialności za politykę prywatności i
            praktyki osób trzecich.
          </Paragraph>
          <Title>K. Aktualizacja informacji</Title>
          <Paragraph>
            Prosimy o informację w przypadku konieczności skorygowania lub
            aktualizowania danych osobowych, w których posiadaniu jesteśmy.
          </Paragraph>
          <Title>L. Ciasteczka</Title>
          <Paragraph>
            Nasza aplikacja (strona) internetowa nie korzysta z plików cookie.
          </Paragraph>
        </CardContent>
      </Card>
    </Container>
  )
}
