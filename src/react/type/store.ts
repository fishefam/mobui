import { Completion } from '@codemirror/autocomplete'
import { MathJaxSubscriberProps } from 'better-react-mathjax'

import { TLanguage, TState } from './common'
import { TAlgoResponseValue, TNormalizedSection } from './data'
import { TSlateEditor, TValue } from './slate'

/**
 * Custom Types for Application State and Store
 *
 * - `TTheme`: Represents the theme of the application ('dark' or 'light').
 * - `TState<T>`: Represents a tuple for state management in the store, including state and a setState function.
 * - `TStore`: Represents the shape of the application state using the React context API.
 * - `TStoreCodeKey`: Represents a union type of keys in the store related to code sections and language.
 * - `TStoreProp<T, U>`: Represents the type of a specific property in the store based on the key `T`,
 *    with options for retrieving state, setState, or both ('pair', 'setstate', 'state').
 *
 */

export type TTheme = 'dark' | 'light'
export type TPanelLayout = 'left' | 'right' | 'top'
export type TMathJax = MathJaxSubscriberProps | undefined

export type TStore = {
  algoAutoCompletionList: TState<Completion[]>
  algorithm: TState<string>
  algorithmPreview: TState<TAlgoResponseValue>
  authornotesCSS: TState<string>
  authornotesHTML: TState<string>
  authornotesJS: TState<string>
  authornotesSlate: TState<TSlateEditor>
  authornotesSlateInitialValue: TState<TValue>
  authornotesSlateReadOnly: TState<boolean>
  editingLanguage: TState<TLanguage>
  feedbackCSS: TState<string>
  feedbackHTML: TState<string>
  feedbackJS: TState<string>
  feedbackSlate: TState<TSlateEditor>
  feedbackSlateInitialValue: TState<TValue>
  feedbackSlateReadOnly: TState<boolean>
  isUnsaved: TState<boolean>
  jsAutoCompletionList: TState<Completion[]>
  mathjax: TState<TMathJax>
  panelLayout: TState<TPanelLayout>
  questionCSS: TState<string>
  questionHTML: TState<string>
  questionJS: TState<string>
  questionName: TState<string>
  questionSlate: TState<TSlateEditor>
  questionSlateInitialValue: TState<TValue>
  questionSlateReadOnly: TState<boolean>
  section: TState<TNormalizedSection>
  theme: TState<TTheme>
}

export type TStoreCodeKey = Extract<keyof TStore, `${TNormalizedSection}${TLanguage}`>
export type TStoreProp<T extends keyof TStore, U extends 'pair' | 'setstate' | 'state' = 'state'> = U extends 'state' ? TStore[T][0] : U extends 'setstate' ? TStore[T][1] : TStore[T]
