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
          main={<></>}
          top={<Navbar />}
        />
      </ThemeProvider>
    </StoreProvider>
  )
}
