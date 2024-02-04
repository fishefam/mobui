import { Completion } from '@codemirror/autocomplete'

import { TLanguage, TSetState } from './common'
import { TNormalizedSection } from './data'
import { TSlateEditor, TValue } from './slate'

export type TTheme = 'dark' | 'light'
export type TStoreProps<T> = [state: T, setState: TSetState<T>]

export type TStore = {
  algoAutoCompletionList: TStoreProps<Completion[]>
  algorithm: TStoreProps<string>
  algorithmPreview: TStoreProps<{ [key: string]: { rangeEnd: string; rangeStart: string; value: string } }>
  authornotesCSS: TStoreProps<string>
  authornotesHTML: TStoreProps<string>
  authornotesJS: TStoreProps<string>
  authornotesSlate: TStoreProps<TSlateEditor>
  authornotesSlateInitialValue: TStoreProps<TValue>
  authornotesSlateReadOnly: TStoreProps<boolean>
  editingLanguage: TStoreProps<TLanguage>
  feedbackCSS: TStoreProps<string>
  feedbackHTML: TStoreProps<string>
  feedbackJS: TStoreProps<string>
  feedbackSlate: TStoreProps<TSlateEditor>
  feedbackSlateInitialValue: TStoreProps<TValue>
  feedbackSlateReadOnly: TStoreProps<boolean>
  isUnsaved: TStoreProps<boolean>
  jsAutoCompletionList: TStoreProps<Completion[]>
  panelLayout: TStoreProps<'left' | 'right' | 'top'>
  questionCSS: TStoreProps<string>
  questionHTML: TStoreProps<string>
  questionJS: TStoreProps<string>
  questionName: TStoreProps<string>
  questionSlate: TStoreProps<TSlateEditor>
  questionSlateInitialValue: TStoreProps<TValue>
  questionSlateReadOnly: TStoreProps<boolean>
  section: TStoreProps<TNormalizedSection>
  theme: TStoreProps<TTheme>
}
export type TStoreCodeKey = Extract<keyof TStore, `${TNormalizedSection}${TLanguage}`>
export type TStoreProp<T extends keyof TStore, U extends 'pair' | 'setstate' | 'state' = 'state'> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]
