import {createRoot} from 'react-dom/client'
import {registerSW} from 'virtual:pwa-register'
import App from './app/App'

const container = document.getElementById('root')!
createRoot(container).render(<App />)

registerSW({immediate: true})
