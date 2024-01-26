import { ReactElement } from 'react'

type TAreas = 'left' | 'main' | 'top'
type TProps = { [key in TAreas]: ReactElement }

export default function Layout({ left, main, top }: TProps) {
  return (
    <>
      <div className="border-b p-3">{top}</div>
      <div className="grid grid-cols-[minmax(10rem,15%)_auto]">
        <div className="col-start-1 col-end-2 hidden md:block">{left}</div>
        <div className="col-start-1 col-end-2 md:col-start-2 md:col-end-3">{main}</div>
      </div>
    </>
  )
}
