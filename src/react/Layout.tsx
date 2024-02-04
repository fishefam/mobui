import Navbar from 'component/Navbar'
import { ReactElement, useRef } from 'react'

type TLayoutProps = { left: ReactElement; main: ReactElement }

/**
 * Layout Component
 *
 * Description:
 * This component defines the layout structure for the application, including a navbar, a left sidebar,
 * and a main content area. It utilizes Tailwind CSS classes for styling.
 *
 * Props:
 * - left (ReactNode): The content to be displayed in the left sidebar.
 * - main (ReactNode): The main content to be displayed in the central area.
 *
 */
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
      <div className="max-w-[100vw] grid-cols-[13rem_auto] !transition-none md:grid">
        <div className="col-start-1 col-end-2 hidden border-r p-3 md:block">{left}</div>
        <div className="col-start-1 col-end-2 h-full p-3 md:col-start-2 md:col-end-3 md:max-w-[calc(100vw-13rem)]">
          {main}
        </div>
      </div>
    </>
  )
}
