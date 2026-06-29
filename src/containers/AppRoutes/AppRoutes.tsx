import {Route, Switch} from 'react-router-dom'

import {PrayPage} from 'src/pages/PrayPage'
import {HowItWorks} from 'src/pages/HowItWorks'
import {ERoutes} from 'src/app/config/routes'
import {PrivacyPolicy} from 'src/components/PrivacyPolicy'

export const AppRoutes = () => (
  <Switch>
    <Route path={ERoutes.HOME} exact component={PrayPage} />
    <Route path={ERoutes.ABOUT} exact component={HowItWorks} />
    <Route path={ERoutes.POLICY} exact component={PrivacyPolicy} />
  </Switch>
)
