import {
  Button,
  Accordion,
  AccordionActions,
  AccordionDetails as MuiExpansionPanelDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import withStyles from '@mui/styles/withStyles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {Prayer} from 'src/containers/Prayer'
import IntentionCard from '../../components/IntentionCard'
import {useIntentions} from 'src/hooks'

// tslint:disable-next-line: object-literal-sort-keys
const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  root: {
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing(1),
    width: 30,
  },
}))

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiExpansionPanelDetails)

interface IntentionPageProps {
  id: string
  prayerId: string
}

const IntentionPage: React.ComponentType<
  RouteComponentProps<IntentionPageProps>
> = (props) => {
  const {id, prayerId} = props.match.params
  const classes = useStyles()
  const {t} = useTranslation()
  const {getIntention} = useIntentions()
  const intention = getIntention(id)
  const [intentionPanel, setIntentionPanel] = useState({
    expanded: true,
  })
  const [prayPanel, setPrayPanel] = useState({
    expanded: Boolean(prayerId),
  })
  const toggleIntentionPanel = (event: object, expanded: boolean) => {
    setIntentionPanel({
      expanded,
    })
  }
  const togglePrayPanel = (event: object, expanded: boolean) => {
    setPrayPanel({
      expanded,
    })
  }

  const openPrayPanel = () => togglePrayPanel({}, true)
  const closeIntentionPanel = () => toggleIntentionPanel({}, false)
  const startPray = () => {
    closeIntentionPanel()
    openPrayPanel()
  }
  // return null if intention not found
  if (!intention) {
    return null
  }

  // TODO GM: use react-chrono

  return (
    <>
      <Grid item={true} key={intention.id} xs={12} sm={6} md={6} lg={4}>
        <div className={classes.root}>
          <Accordion
            expanded={intentionPanel.expanded}
            onChange={toggleIntentionPanel}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {intentionPanel.expanded ? t('prayer.panelIntention') : intention.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.root}>
              <IntentionCard
                intention={intention}
                detailed={true}
                isLoading={false}
              />
            </AccordionDetails>
            <AccordionActions>
              <Button size="small" color="primary" onClick={startPray}>
                {t('prayer.startDecade')}
              </Button>
            </AccordionActions>
          </Accordion>
          <Accordion expanded={prayPanel.expanded} onChange={togglePrayPanel}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>{t('prayer.panelPrayer')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Prayer intention={intention} />
            </AccordionDetails>
          </Accordion>
        </div>
      </Grid>
    </>
  )
}

export default IntentionPage
