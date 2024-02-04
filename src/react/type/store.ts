import { Completion } from '@codemirror/autocomplete'

import { TLanguage, TSetState } from './common'
import { TAlgoResponseValue, TNormalizedSection } from './data'
import { TSlateEditor, TValue } from './slate'

/**
 * Custom Types for Application State and Store
 *
 * - `TTheme`: Represents the theme of the application ('dark' or 'light').
 * - `TStoreProps<T>`: Represents a tuple for state management in the store, including state and a setState function.
 * - `TStore`: Represents the shape of the application state using the React context API.
 * - `TStoreCodeKey`: Represents a union type of keys in the store related to code sections and language.
 * - `TStoreProp<T, U>`: Represents the type of a specific property in the store based on the key `T`,
 *    with options for retrieving state, setState, or both ('pair', 'setstate', 'state').
 *
 */

export type TTheme = 'dark' | 'light'
export type TPanelLayout = 'left' | 'right' | 'top'
export type TStoreProps<T> = [state: T, setState: TSetState<T>]

export type TStore = {
  algoAutoCompletionList: TStoreProps<Completion[]>
  algorithm: TStoreProps<string>
  algorithmPreview: TStoreProps<TAlgoResponseValue>
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
  panelLayout: TStoreProps<TPanelLayout>
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
