import MainArea from 'component/MainArea'
import Navbar from 'component/Navbar'
import Sidebar from 'component/Sidebar'
import ThemeProvider from 'shadcn/ThemeProvider'

import Layout from './Layout'
import StoreProvider from './Store'

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <Layout
          left={<Sidebar />}
          main={<MainArea />}
          top={<Navbar />}
        />
      </ThemeProvider>
    </StoreProvider>
  )
}
