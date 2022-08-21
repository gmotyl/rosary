import Layout from '../containers/Layout'
import AuthProvider from '../context/AuthProvider'
import {UIStateProvider} from '../context/UIStateProvider'
import {StylesProvider} from './StylesProvider'

const App = () => {
  return (
    <div>
      <StylesProvider>
        <AuthProvider>
          <UIStateProvider>
            <Layout />
          </UIStateProvider>
        </AuthProvider>
      </StylesProvider>
    </div>
  )
}

export default App
