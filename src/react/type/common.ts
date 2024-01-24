import { Dispatch, ReactElement, SetStateAction } from 'react'

export type TObject<T = unknown> = Record<string, T>
export type TSetState<T> = Dispatch<SetStateAction<T>>
export type TProps<T = TObject> = T & { children: ReactElement }
