import Navbar from 'component/Navbar'
import ThemeProvider from 'shadcn/ThemeProvider'

import ContextProvider from './Context'

export default function App() {
  return (
    <ContextProvider>
      <ThemeProvider>
        <Navbar />
        {/* <Layout
        left={<Sidebar />}
        main={<MainArea />}
        top={<Navbar />}
      /> */}
      </ThemeProvider>
    </ContextProvider>
  )
}
