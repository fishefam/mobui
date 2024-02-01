import './global.scss'

import { getLocalStorage } from 'lib/data'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

createRoot(document.getElementById(getLocalStorage().reactRootId)!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
