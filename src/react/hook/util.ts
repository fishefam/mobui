import { useWindowSize as _useWindowSize } from '@uidotdev/usehooks'
import { getLocalStorage } from 'lib/data'
import { RefObject, useEffect, useState } from 'react'

export function useElementHeight<T extends HTMLElement>(ref: RefObject<T>) {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (ref.current) setHeight(ref.current.clientHeight)
  }, [ref])
  return height
}

export function useWindowsSize() {
  const { height = 0, width = 0 } = _useWindowSize() as { height: number; width: number }
  return { height, width }
}

export function useRemoveRootLoader() {
  useEffect(() => {
    const cmEditor = document.querySelector('.cm-editor')
    if (cmEditor) document.querySelector('#' + getLocalStorage().rootLoaderId)?.remove()
  })
}
