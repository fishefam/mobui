import { Completion } from '@codemirror/autocomplete'

import { TLanguage, TSetState } from './common'
import { TAlgoResponseValue, TNormalizedSection } from './data'
import { TSlateEditor, TValue } from './slate'

/**
 * Custom Types for Application State and Store
 *
 * - `TTheme`: Represents the theme of the application ('dark' or 'light').
 * - `TStoreState<T>`: Represents a tuple for state management in the store, including state and a setState function.
 * - `TStore`: Represents the shape of the application state using the React context API.
 * - `TStoreCodeKey`: Represents a union type of keys in the store related to code sections and language.
 * - `TStoreProp<T, U>`: Represents the type of a specific property in the store based on the key `T`,
 *    with options for retrieving state, setState, or both ('pair', 'setstate', 'state').
 *
 */

export type TTheme = 'dark' | 'light'
export type TPanelLayout = 'left' | 'right' | 'top'
export type TStoreState<T> = [state: T, setState: TSetState<T>]

export type TStore = {
  algoAutoCompletionList: TStoreState<Completion[]>
  algorithm: TStoreState<string>
  algorithmPreview: TStoreState<TAlgoResponseValue>
  authornotesCSS: TStoreState<string>
  authornotesHTML: TStoreState<string>
  authornotesJS: TStoreState<string>
  authornotesSlate: TStoreState<TSlateEditor>
  authornotesSlateInitialValue: TStoreState<TValue>
  authornotesSlateReadOnly: TStoreState<boolean>
  editingLanguage: TStoreState<TLanguage>
  feedbackCSS: TStoreState<string>
  feedbackHTML: TStoreState<string>
  feedbackJS: TStoreState<string>
  feedbackSlate: TStoreState<TSlateEditor>
  feedbackSlateInitialValue: TStoreState<TValue>
  feedbackSlateReadOnly: TStoreState<boolean>
  isUnsaved: TStoreState<boolean>
  jsAutoCompletionList: TStoreState<Completion[]>
  panelLayout: TStoreState<TPanelLayout>
  questionCSS: TStoreState<string>
  questionHTML: TStoreState<string>
  questionJS: TStoreState<string>
  questionName: TStoreState<string>
  questionSlate: TStoreState<TSlateEditor>
  questionSlateInitialValue: TStoreState<TValue>
  questionSlateReadOnly: TStoreState<boolean>
  section: TStoreState<TNormalizedSection>
  theme: TStoreState<TTheme>
}

export type TStoreCodeKey = Extract<keyof TStore, `${TNormalizedSection}${TLanguage}`>
export type TStoreProp<T extends keyof TStore, U extends 'pair' | 'setstate' | 'state' = 'state'> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]
