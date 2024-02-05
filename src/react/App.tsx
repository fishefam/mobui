import { MathJaxContext as MathJaxProvider } from 'better-react-mathjax'
import MainArea from 'component/MainArea'
import Sidebar from 'component/Sidebar'
import Toaster from 'component/Sonner'
import { getLocalStorage } from 'lib/data'

import Layout from './Layout'
import StoreProvider from './Store'

/**
 * Main Application Component
 *
 * Description:
 * This component serves as the entry point for the application, wrapping the entire app
 * with the `StoreProvider` to provide access to the application state. It also includes
 * the main layout structure using the `Layout` component, with a sidebar and a main area.
 * Additionally, the `Toaster` component is rendered for displaying toast notifications.
 *
 * Components Used:
 * - `StoreProvider`: Provides the application state using the React context API.
 * - `Layout`: Defines the overall layout structure with a sidebar and a main area.
 * - `Sidebar`: Represents the content for the left sidebar in the layout.
 * - `MainArea`: Represents the content for the main area in the layout.
 * - `Toaster`: Displays toast notifications for user feedback.
 *
 * Note: The Navbar component is placed directly in the Layout component.
 *
 */
export default function App() {
  return (
    <MathJaxProvider
      config={{ startup: { typeset: false } }}
      src={getLocalStorage().extURL + 'asset/mathjax.js'}
    >
      <StoreProvider>
        <Layout
          left={<Sidebar />}
          main={<MainArea />}
        />
        <Toaster />
      </StoreProvider>
    </MathJaxProvider>
  )
}
