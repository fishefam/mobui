import './style.scss'

import { getLocalStorage } from 'lib/data'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

/**
 * Entry Point for React App
 *
 * This block of code initializes and renders the root React component in strict mode.
 * It assumes the presence of a root HTML element obtained from local storage.
 *
 * Code Explanation:
 * - `getLocalStorage()`: Retrieves data from local storage, assumed to contain the React root element ID.
 *
 * Note: Ensure that the root element ID is available in local storage before using this code.
 *
 */
createRoot(document.getElementById(getLocalStorage().reactRootId)!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
