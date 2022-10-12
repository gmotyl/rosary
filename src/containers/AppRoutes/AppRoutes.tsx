import {Route, Switch} from 'react-router-dom'

import IntentionPage from 'src/pages/IntentionPage'
import IntentionList from 'src/pages/IntentionList'
import LoginPage from 'src/pages/LoginPage'
import {AddIntentionPage} from 'src/pages/AddIntentionPage'
import {HowItWorks} from 'src/pages/HowItWorks'
import {ERoutes} from 'src/app/config/routes'
import {PrivacyPolicy} from 'src/components/PrivacyPolicy'

export const AppRoutes = () => {
  // TODO: #37 Add "how it works" on homepage
  return (
    <Switch>
      <Route path={ERoutes.HOME} exact={true} component={IntentionList} />
      <Route path={ERoutes.POLICY} exact={true} component={PrivacyPolicy} />
      <Route path={ERoutes.LOGIN} exact={true} component={LoginPage} />
      <Route path={ERoutes.ABOUT} exact={true} component={HowItWorks} />
      <Route
        path={ERoutes.ADD_INTENTION}
        exact={true}
        component={AddIntentionPage}
      />
      <Route
        path="/intention/:id/(prayers)?/:prayerId?"
        component={IntentionPage}
      />
    </Switch>
  )
}
