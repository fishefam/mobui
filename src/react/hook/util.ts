import { RefObject, useEffect, useState } from 'react'

export function useElementHeight<T extends HTMLElement>(ref: RefObject<T>) {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (ref.current) setHeight(ref.current.clientHeight)
  }, [ref])
  return height
}
