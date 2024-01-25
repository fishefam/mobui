import MainArea from 'component/MainArea'
import Navbar from 'component/Navbar'
import Sidebar from 'component/Sidebar'

import Context from './Context'
import Layout from './Layout'

export default function App() {
  return (
    <Context>
      <Layout
        left={<Sidebar />}
        main={<MainArea />}
        top={<Navbar />}
      />
    </Context>
  )
}
