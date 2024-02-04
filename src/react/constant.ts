import { getData, getLocalStorage } from 'lib/data'
import { createSlateEditor } from 'lib/slate'
import { deserialize } from 'lib/slate/deserialization'
import { serialize } from 'lib/slate/serialization'
import { getDOM, getLocalStorageItem } from 'lib/util'
import { TStore, TTheme } from 'type/store'

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

const placeholder = () => {}
const initial_theme =
  (localStorage.getItem('theme') as TTheme) ??
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

/* Initial state for the application using the React context API */
export const INITIAL_STORE: TStore = {
  algoAutoCompletionList: [[], placeholder],
  algorithm: [getData('algorithm', undefined), placeholder],
  algorithmPreview: [{}, placeholder],
  authornotesCSS: [getData('authornotes', 'CSS'), placeholder],
  authornotesHTML: [authornotesHTML, placeholder],
  authornotesJS: [getData('authornotes', 'JS'), placeholder],
  authornotesSlate: [createSlateEditor(), placeholder],
  authornotesSlateInitialValue: [authornotesSlateInitialValue, placeholder],
  authornotesSlateReadOnly: [false, placeholder],
  editingLanguage: ['HTML', placeholder],
  feedbackCSS: [getData('feedback', 'CSS'), placeholder],
  feedbackHTML: [feedbackHTML, placeholder],
  feedbackJS: [getData('feedback', 'JS'), placeholder],
  feedbackSlate: [createSlateEditor(), placeholder],
  feedbackSlateInitialValue: [feedbackSlateInitialValue, placeholder],
  feedbackSlateReadOnly: [false, placeholder],
  isUnsaved: [false, placeholder],
  jsAutoCompletionList: [[], placeholder],
  panelLayout: [getLocalStorage().panelLayout as 'left', placeholder],
  questionCSS: [getData('question', 'CSS'), placeholder],
  questionHTML: [questionHTML, placeholder],
  questionJS: [getData('question', 'JS'), placeholder],
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', placeholder],
  questionSlate: [createSlateEditor(), placeholder],
  questionSlateInitialValue: [questionSlateInitialValue, placeholder],
  questionSlateReadOnly: [false, placeholder],
  section: ['question', placeholder],
  theme: [initial_theme, placeholder],
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
