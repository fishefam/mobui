import { TSetState } from './common'

type TSection = 'question' | 'feedback' | 'authornotes' | 'algorithm'
type TStoreProps<T> = [state: T, setState: TSetState<T>]

export type TStore = {
  algorithmCSS: TStoreProps<string>
  algorithmHTML: TStoreProps<string>
  algorithmJS: TStoreProps<string>
  authornotesCSS: TStoreProps<string>
  authornotesHTML: TStoreProps<string>
  authornotesJS: TStoreProps<string>
  feedbackCSS: TStoreProps<string>
  feedbackHTML: TStoreProps<string>
  feedbackJS: TStoreProps<string>
  questionCSS: TStoreProps<string>
  questionHTML: TStoreProps<string>
  questionJS: TStoreProps<string>
  questionName: TStoreProps<string>
  section: TStoreProps<TSection>
}
export type TStoreCodeKey = Exclude<keyof TStore, 'questionName' | 'section'>
export type TStoreProp<
  T extends keyof TStore,
  U extends 'state' | 'setstate' | 'pair' = 'state',
> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]

export type TLocalStorageKey = 'data' | 'extURL' | 'uidHash' | 'classId' | 'username' | 'reponame'
