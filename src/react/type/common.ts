import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'

/* Generic */
export type TObject<T extends string | number = string, U = unknown> = Record<T, U>

/* React */
export type TSetState<T> = Dispatch<SetStateAction<T>>
export type TProps<T = TObject> = T & { children: ReactNode }
export type TComponent<T = unknown> = (props: T) => ReactElement
