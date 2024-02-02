import Navbar from 'component/Navbar'
import { ReactElement, useRef } from 'react'

type TLayoutProps = { left: ReactElement; main: ReactElement }

export default function Layout({ left, main }: TLayoutProps) {
  const navbarRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div
        ref={navbarRef}
        className="relative z-[3] border-b p-3"
      >
        <Navbar container={navbarRef} />
      </div>
      <div className="max-w-[100vw] grid-cols-[13rem_auto] md:grid">
        <div className="col-start-1 col-end-2 hidden border-r p-3 md:block">{left}</div>
        <div className="col-start-1 col-end-2 h-full p-3 md:col-start-2 md:col-end-3 md:max-w-[calc(100vw-13rem)]">
          {main}
        </div>
      </div>
    </>
  )
}
