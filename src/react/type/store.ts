import { Completion } from '@codemirror/autocomplete'

import { TSetState } from './common'
import { TSlateEditor } from './slate'

export type TSection = 'algorithm' | 'authornotes' | 'feedback' | 'question'
export type TStorePrefix = 'algorithm' | 'authornotes' | 'feedback' | 'question'
export type TLanguage = 'CSS' | 'HTML' | 'JS'
export type TStoreProps<T> = [state: T, setState: TSetState<T>]
export type TTheme = 'dark' | 'light'

export type TStore = {
  algoAutoCompletionList: TStoreProps<Completion[]>,
  algorithm: TStoreProps<string>,
  algorithmPreview: TStoreProps<{ [key: string]: { rangeEnd: string; rangeStart: string; value: string } }>,
  authornotesCSS: TStoreProps<string>,
  authornotesHTML: TStoreProps<string>,
  authornotesJS: TStoreProps<string>,
  authornotesSlate: TStoreProps<TSlateEditor>,
  authornotesSlateReadOnly: TStoreProps<boolean>,
  feedbackCSS: TStoreProps<string>
  feedbackHTML: TStoreProps<string>
  feedbackJS: TStoreProps<string>
  feedbackSlate: TStoreProps<TSlateEditor>
  feedbackSlateReadOnly: TStoreProps<boolean>
  jsAutoCompletionList: TStoreProps<Completion[]>
  questionCSS: TStoreProps<string>
  questionHTML: TStoreProps<string>
  questionJS: TStoreProps<string>
  questionName: TStoreProps<string>
  questionSlate: TStoreProps<TSlateEditor>
  questionSlateReadOnly: TStoreProps<boolean>
  section: TStoreProps<TSection>
  theme: TStoreProps<TTheme>
}
export type TStoreCodeKey = Extract<keyof TStore, `${TStorePrefix}${TLanguage}`>
export type TStoreProp<T extends keyof TStore, U extends 'pair' | 'setstate' | 'state' = 'state'> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]

export type TLocalStorageKey = 'classId' | 'data' | 'extURL' | 'reponame' | 'uidHash' | 'username'
