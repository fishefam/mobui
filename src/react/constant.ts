import { getData, getLocalStorage } from 'lib/data'
import { createSlateEditor } from 'lib/slate'
import { getLocalStorageItem } from 'lib/util'
import { TStore, TTheme } from 'type/store'

const PLACEHOLDER = () => {}
const INITIAL_THEME =
  (localStorage.getItem('theme') as TTheme) ??
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export const INITIAL_STORE: TStore = {
  algoAutoCompletionList: [[], PLACEHOLDER],
  algorithm: [getData('algorithm', undefined), PLACEHOLDER],
  algorithmPreview: [{}, PLACEHOLDER],
  authornotesCSS: [getData('authornotes', 'CSS'), PLACEHOLDER],
  authornotesHTML: [getData('authornotes', 'HTML'), PLACEHOLDER],
  authornotesJS: [getData('authornotes', 'JS'), PLACEHOLDER],
  authornotesSlate: [createSlateEditor(), PLACEHOLDER],
  authornotesSlateReadOnly: [false, PLACEHOLDER],
  editingLanguage: ['HTML', PLACEHOLDER],
  feedbackCSS: [getData('feedback', 'CSS'), PLACEHOLDER],
  feedbackHTML: [getData('feedback', 'HTML'), PLACEHOLDER],
  feedbackJS: [getData('feedback', 'JS'), PLACEHOLDER],
  feedbackSlate: [createSlateEditor(), PLACEHOLDER],
  feedbackSlateReadOnly: [false, PLACEHOLDER],
  isUnsaved: [false, PLACEHOLDER],
  jsAutoCompletionList: [[], PLACEHOLDER],
  panelLayout: [getLocalStorage().panelLayout as 'left', PLACEHOLDER],
  questionCSS: [getData('question', 'CSS'), PLACEHOLDER],
  questionHTML: [getData('question', 'HTML'), PLACEHOLDER],
  questionJS: [getData('question', 'JS'), PLACEHOLDER],
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', PLACEHOLDER],
  questionSlate: [createSlateEditor(), PLACEHOLDER],
  questionSlateReadOnly: [false, PLACEHOLDER],
  section: ['question', PLACEHOLDER],
  theme: [INITIAL_THEME, PLACEHOLDER],
}

export const BREAK_POINT = {
  '2xl': 1536,
  'lg': 1024,
  'md': 768,
  'sm': 640,
  'xl': 1280,
}
