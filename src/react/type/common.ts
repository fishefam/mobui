import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'

/* Generic */
export type TLanguage = 'CSS' | 'HTML' | 'JS'
export type TObject<T extends number | string = string, U = unknown> = Record<T, U>

/* React */
export type TSetState<T> = Dispatch<SetStateAction<T>>
export type TProps<T = TObject> = T & { children: ReactNode }
export type TComponent<T = unknown> = (props: T) => ReactElement

export type TPreviewWindow = Window & {
  window: Window & {
    MathJax: {
      Hub: {
        Queue: (params: ['Typeset', MathJax.Hub, HTMLElement | string | undefined]) => void
      }
    }
    mathJaxConfigUrl: string
  }
}

declare global {
  interface Window {
    debouncer?: NodeJS.Timeout
    previewWindow?: TPreviewWindow
  }
}
