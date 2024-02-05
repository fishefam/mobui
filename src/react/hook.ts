import { useWindowSize as _useWindowSize } from '@uidotdev/usehooks'
import { getLocalStorage } from 'lib/data'
import { useEffect } from 'react'

export function useWindowSize() {
  const { height = 0, width = 0 } = _useWindowSize() as { [key in 'height' | 'width']: number }
  return { height, width }
}

export function useRemoveRootLoader() {
  useEffect(() => {
    const cmEditor = document.querySelector('.cm-editor')
    if (cmEditor) document.querySelector('#' + getLocalStorage().rootLoaderId)?.remove()
  })
}
