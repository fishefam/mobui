import { TSetState } from './common'

type TSection = 'question' | 'feedback' | 'authornotes' | 'algorithm'
type TStoreProps<T> = [state: T, setState: TSetState<T>]

export type TStore = { questionName: TStoreProps<string>; section: TStoreProps<TSection> }
export type TStoreProp<
  T extends keyof TStore,
  U extends 'state' | 'setstate' | 'pair' = 'state',
> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]

export type TLocalStorageKey = 'data' | 'extURL' | 'uidHash' | 'classId' | 'username' | 'reponame'
