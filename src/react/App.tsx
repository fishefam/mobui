import Navbar from 'component/Navbar'
import ThemeProvider from 'shadcn/ThemeProvider'

import Layout from './Layout'
import StoreProvider from './Store'

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <Layout
          left={<></>}
          main={<></>}
          top={<Navbar />}
        />
      </ThemeProvider>
    </StoreProvider>
  )
}
