import MainArea from 'component/MainArea'
import Sidebar from 'component/Sidebar'
import Toaster from 'component/Sonner'

import Layout from './Layout'
import StoreProvider from './Store'

export default function App() {
  return (
    <StoreProvider>
      <Layout
        left={<Sidebar />}
        main={<MainArea />}
      />
      <Toaster />
    </StoreProvider>
  )
}
