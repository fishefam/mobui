import { ReactElement } from 'react'

type TAreas = 'left' | 'main' | 'top'
type TLayoutProps = { [key in TAreas]: ReactElement }

export default function Layout({ left, main, top }: TLayoutProps) {
  return (
    <>
      <div className="relative z-[1] border-b p-3">{top}</div>
      <div className="max-w-[100vw] grid-cols-[13rem_auto] md:grid">
        <div className="col-start-1 col-end-2 hidden border-r p-3 md:block">{left}</div>
        <div className="col-start-1 col-end-2 h-full p-3 md:col-start-2 md:col-end-3 md:max-w-[calc(100vw-13rem)]">
          {main}
        </div>
      </div>
    </>
  )
}
