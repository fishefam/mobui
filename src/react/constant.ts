import { Completion } from '@codemirror/autocomplete'
import { getData, getLocalStorage } from 'lib/data'
import { createSlateEditor } from 'lib/slate'
import { deserialize } from 'lib/slate/deserialization'
import { serialize } from 'lib/slate/serialization'
import { getDOM, getLocalStorageItem } from 'lib/util'
import { TLanguage } from 'type/common'
import { TNormalizedSection } from 'type/data'
import { TStore, TStoreState } from 'type/store'

/**
 * Initialization of Application State and Constants
 *
 * Description:
 * This file contains the initialization of the application state (`INITIAL_STORE`) and various constants.
 * It also includes functions for obtaining default data, breakpoints, and a typing placeholder.
 *
 * Constants:
 * - `INITIAL_STORE`: Initial state for the application using the React context API.
 * - `BREAK_POINT`: Breakpoints for responsive design based on screen width.
 *
 */

const questionDOM = getDOM('question')
const authornotesDOM = getDOM('authornotes')
const feedbackDOM = getDOM('feedback')

const questionSlateInitialValue = deserialize(questionDOM)
const authornotesSlateInitialValue = deserialize(authornotesDOM)
const feedbackSlateInitialValue = deserialize(feedbackDOM)

const questionHTML = serialize(questionSlateInitialValue)
const authornotesHTML = serialize(authornotesSlateInitialValue)
const feedbackHTML = serialize(feedbackSlateInitialValue)

const initial_theme =
  getLocalStorage().theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

/* Initial state for the application using the React context API */
export const INITIAL_STORE: TStore = {
  algoAutoCompletionList: makeState<Completion[]>([]),
  algorithm: makeState(getData('algorithm', null)),
  algorithmPreview: makeState({}),
  authornotesCSS: makeState(getData('authornotes', 'CSS')),
  authornotesHTML: makeState(authornotesHTML),
  authornotesJS: makeState(getData('authornotes', 'JS')),
  authornotesSlate: makeState(createSlateEditor()),
  authornotesSlateInitialValue: makeState(authornotesSlateInitialValue),
  authornotesSlateReadOnly: makeState(false),
  editingLanguage: makeState<TLanguage>('HTML'),
  feedbackCSS: makeState(getData('feedback', 'CSS')),
  feedbackHTML: makeState(feedbackHTML),
  feedbackJS: makeState(getData('feedback', 'JS')),
  feedbackSlate: makeState(createSlateEditor()),
  feedbackSlateInitialValue: makeState(feedbackSlateInitialValue),
  feedbackSlateReadOnly: makeState(false),
  isUnsaved: makeState(false),
  jsAutoCompletionList: makeState<Completion[]>([]),
  panelLayout: makeState(getLocalStorage().panelLayout),
  questionCSS: makeState(getData('question', 'CSS')),
  questionHTML: makeState(questionHTML),
  questionJS: makeState(getData('question', 'JS')),
  questionName: makeState(JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer'),
  questionSlate: makeState(createSlateEditor()),
  questionSlateInitialValue: makeState(questionSlateInitialValue),
  questionSlateReadOnly: makeState(false),
  section: makeState<TNormalizedSection>('question'),
  theme: makeState(initial_theme),
}

/* Breakpoints for responsive design based on screen width */
export const BREAK_POINT = {
  '2xl': 1536,
  'lg': 1024,
  'md': 768,
  'sm': 640,
  'xl': 1280,
}

/* Function to get the typing placeholder */
export function GET_TYPING_PLACEHOLDER() {
  return 'Start typing...'
}

function makeState<T>(state: T): TStoreState<T> {
  return [state, () => {}]
}
