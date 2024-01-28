import { TSetState } from './common'
import { TSlateEditor } from './slate'

type TSection = 'question' | 'feedback' | 'authornotes' | 'algorithm'
type TStorePrefix = 'algorithm' | 'authornotes' | 'feedback' | 'question'
type TStoreProps<T> = [state: T, setState: TSetState<T>]

export type TStore = {
  algorithm: TStoreProps<string>
  algorithmPreview: TStoreProps<{ [key: string]: { rangeEnd: string; rangeStart: string; value: string } }>
  authornotesCSS: TStoreProps<string>
  authornotesHTML: TStoreProps<string>
  authornotesJS: TStoreProps<string>
  authornotesSlate: TStoreProps<TSlateEditor>
  feedbackCSS: TStoreProps<string>
  feedbackHTML: TStoreProps<string>
  feedbackJS: TStoreProps<string>
  feedbackSlate: TStoreProps<TSlateEditor>
  questionCSS: TStoreProps<string>
  questionHTML: TStoreProps<string>
  questionJS: TStoreProps<string>
  questionName: TStoreProps<string>
  questionSlate: TStoreProps<TSlateEditor>
  section: TStoreProps<TSection>
}
export type TStoreCodeKey = Exclude<
  keyof TStore,
  'questionName' | 'section' | 'algorithmPreview' | `${TStorePrefix}Slate`
>
export type TStoreProp<T extends keyof TStore, U extends 'state' | 'setstate' | 'pair' = 'state'> = U extends 'state'
  ? TStore[T][0]
  : U extends 'setstate'
    ? TStore[T][1]
    : TStore[T]

export type TLocalStorageKey = 'data' | 'extURL' | 'uidHash' | 'classId' | 'username' | 'reponame'
