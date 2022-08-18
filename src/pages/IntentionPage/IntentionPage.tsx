import {
  Button,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {withStyles} from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import {useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'

import {Prayer} from 'src/containers/Prayer'
import {useIntention} from '../../hooks/useRosaryApi'
import IntentionCard from '../../components/IntentionCard'
import PrayDisclaimerCard from '../../components/PrayDisclaimerCard'
import {useIntentionStatisticRequest} from 'src/hooks/useRosaryApi/useInentionStatistic'
import {IntentionStatistic} from './IntentionStatistics'

// tslint:disable-next-line: object-literal-sort-keys
const useStyles = makeStyles({
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
})

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiExpansionPanelDetails)

interface IntentionPageProps {
  id: string
  prayerId: string
}

const IntentionPage: React.ComponentType<RouteComponentProps<
  IntentionPageProps
>> = (props) => {
  const updateStats = () => {
    setTimeout(
      () => requestIntentionStatistic({intention: `intentions/${id}`}, ''),
      1000,
    )
  }
  const {id, prayerId} = props.match.params
  const classes = useStyles()
  const {state} = useIntention(id)
  const intention = state.data
  const [intentionPanel, setIntentionPanel] = useState({
    expanded: true,
  })
  const [prayPanel, setPrayPanel] = useState({
    expanded: Boolean(prayerId),
  })
  const [helpPanel, setHelpPanel] = useState({
    expanded: false,
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
  const toggleHelpPanel = (event: object, expanded: boolean) => {
    setHelpPanel({
      expanded,
    })
  }
  const openPrayPanel = () => togglePrayPanel({}, true)
  const closeIntentionPanel = () => toggleIntentionPanel({}, false)
  const startPray = () => {
    closeIntentionPanel()
    openPrayPanel()
  }
  const {
    rosaryCount,
    prayFinished,
    prayInProgress,
    requestIntentionStatistic,
  } = useIntentionStatisticRequest()

  React.useEffect(updateStats, [])

  return (
    <>
      <Grid container={true} spacing={2}>
        <Grid item={true} key={intention.id} xs={12} sm={6} md={6} lg={4}>
          <div className={classes.root}>
            <ExpansionPanel
              expanded={intentionPanel.expanded}
              onChange={toggleIntentionPanel}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {intentionPanel.expanded ? 'Intencja' : intention.title}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.root}>
                <IntentionCard
                  intention={intention}
                  detailed={true}
                  isLoading={state.isLoading}
                />
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button size="small" color="primary" onClick={startPray}>
                  Odmów dziesiątek
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={prayPanel.expanded}
              onChange={togglePrayPanel}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>Modlitwa</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Prayer
                  intention={intention}
                  prayerId={prayerId}
                  updateStats={updateStats}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <Paper className={classes.root}>
              <IntentionStatistic
                rosaryCount={rosaryCount}
                prayFinished={prayFinished}
                prayInProgress={prayInProgress}
                updateStats={updateStats}
                intentionId={id}
              />
            </Paper>
          </div>
        </Grid>
        <Grid item={true} key={2} xs={12} sm={6} md={6} lg={8}>
          <ExpansionPanel
            expanded={helpPanel.expanded}
            onChange={toggleHelpPanel}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>
                Jak to działa ?
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <PrayDisclaimerCard />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </>
  )
}

export default IntentionPage
