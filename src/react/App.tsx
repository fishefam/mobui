import MainArea from 'component/MainArea'
import Navbar from 'component/Navbar'
import Sidebar from 'component/Sidebar'

import Layout from './Layout'
import StoreProvider from './Store'

export default function App() {
  return (
    <StoreProvider>
      <Layout
        left={<Sidebar />}
        main={<MainArea />}
        top={<Navbar />}
      />
    </StoreProvider>
  )
}
