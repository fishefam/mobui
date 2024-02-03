import { getData, getLocalStorage } from 'lib/data'
import { createSlateEditor } from 'lib/slate'
import { deserialize } from 'lib/slate/deserialization'
import { serialize } from 'lib/slate/serialization'
import { getLocalStorageItem } from 'lib/util'
import { TNormalizedSection } from 'type/data'
import { TStore, TTheme } from 'type/store'

const getDOM = (section: TNormalizedSection) =>
  new DOMParser().parseFromString(getData(section, 'HTML').replace(/>(\s|\t|\r|\n|\v)*</g, '><'), 'text/html').body

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

export function GET_TYPING_PLACEHOLDER() {
  return 'Start typing...'
}
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

export const BREAK_POINT = {
  '2xl': 1536,
  'lg': 1024,
  'md': 768,
  'sm': 640,
  'xl': 1280,
}
