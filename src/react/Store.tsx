import { createSlateEditor } from 'lib/slate'
import { getLocalStorageItem } from 'lib/util'
import { createContext, useContext, useEffect, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp, TTheme } from 'type/store'

const PLACEHOLDER = () => {}
const INITIAL_THEME = (localStorage.getItem('theme') as TTheme) ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const INITIAL_STORE: TStore = {
  algoAutoCompletionList: [[], PLACEHOLDER],
  algorithm: ['', PLACEHOLDER],
  algorithmPreview: [{}, PLACEHOLDER],
  authornotesCSS: ['', PLACEHOLDER],
  authornotesHTML: ['', PLACEHOLDER],
  authornotesJS: ['', PLACEHOLDER],
  authornotesSlate: [createSlateEditor(), PLACEHOLDER],
  authornotesSlateReadOnly: [false, PLACEHOLDER],
  feedbackCSS: ['', PLACEHOLDER],
  feedbackHTML: ['', PLACEHOLDER],
  feedbackJS: ['', PLACEHOLDER],
  feedbackSlate: [createSlateEditor(), PLACEHOLDER],
  feedbackSlateReadOnly: [false, PLACEHOLDER],
  jsAutoCompletionList: [[], PLACEHOLDER],
  questionCSS: ['', PLACEHOLDER],
  questionHTML: ['', PLACEHOLDER],
  questionJS: ['', PLACEHOLDER],
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', PLACEHOLDER],
  questionSlate: [createSlateEditor(), PLACEHOLDER],
  questionSlateReadOnly: [false, PLACEHOLDER],
  section: ['question', PLACEHOLDER],
  theme: [INITIAL_THEME, PLACEHOLDER],
}

const Store = createContext<TStore>(INITIAL_STORE)

export default function StoreProvider(props: TProps) {
  const algorithm = useState<TStoreProp<'algorithm'>>(getInitialState('algorithm'))
  const algorithmPreview = useState<TStoreProp<'algorithmPreview'>>(getInitialState('algorithmPreview'))
  const authornotesCSS = useState<TStoreProp<'authornotesCSS'>>(getInitialState('authornotesCSS'))
  const authornotesHTML = useState<TStoreProp<'authornotesHTML'>>(getInitialState('authornotesHTML'))
  const authornotesJS = useState<TStoreProp<'authornotesJS'>>(getInitialState('authornotesJS'))
  const authornotesSlate = useState<TStoreProp<'authornotesSlate'>>(getInitialState('authornotesSlate'))
  const authornotesSlateReadOnly = useState<TStoreProp<'authornotesSlateReadOnly'>>(getInitialState('authornotesSlateReadOnly'))
  const algoAutoCompletionList = useState<TStoreProp<'algoAutoCompletionList'>>(getInitialState('algoAutoCompletionList'))
  const jsAutoCompletionList = useState<TStoreProp<'jsAutoCompletionList'>>(getInitialState('jsAutoCompletionList'))
  const feedbackCSS = useState<TStoreProp<'feedbackCSS'>>(getInitialState('feedbackCSS'))
  const feedbackHTML = useState<TStoreProp<'feedbackHTML'>>(getInitialState('feedbackHTML'))
  const feedbackJS = useState<TStoreProp<'feedbackJS'>>(getInitialState('feedbackJS'))
  const feedbackSlate = useState<TStoreProp<'feedbackSlate'>>(getInitialState('feedbackSlate'))
  const feedbackSlateReadOnly = useState<TStoreProp<'feedbackSlateReadOnly'>>(getInitialState('feedbackSlateReadOnly'))
  const questionCSS = useState<TStoreProp<'questionCSS'>>(getInitialState('questionCSS'))
  const questionHTML = useState<TStoreProp<'questionHTML'>>(getInitialState('questionHTML'))
  const questionJS = useState<TStoreProp<'questionJS'>>(getInitialState('questionJS'))
  const questionName = useState<TStoreProp<'questionName'>>(getInitialState('questionName'))
  const questionSlate = useState<TStoreProp<'questionSlate'>>(getInitialState('questionSlate'))
  const questionSlateReadOnly = useState<TStoreProp<'questionSlateReadOnly'>>(getInitialState('questionSlateReadOnly'))
  const section = useState<TStoreProp<'section'>>(getInitialState('section'))
  const theme = useState<TStoreProp<'theme'>>(getInitialState('theme'))

  useThemeChange(theme[0])

  return (
    <Store.Provider
      {...props}
      value={{
        algoAutoCompletionList,
        algorithm,
        algorithmPreview,
        authornotesCSS,
        authornotesHTML,
        authornotesJS,
        authornotesSlate,
        authornotesSlateReadOnly,
        feedbackCSS,
        feedbackHTML,
        feedbackJS,
        feedbackSlate,
        feedbackSlateReadOnly,
        jsAutoCompletionList,
        questionCSS,
        questionHTML,
        questionJS,
        questionName,
        questionSlate,
        questionSlateReadOnly,
        section,
        theme,
      }}
    />
  )
}

export function useStore() {
  return useContext(Store)
}

function useThemeChange(theme: TTheme) {
  useEffect(() => {
    const html = document.querySelector('html')!
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
    html.style.colorScheme = theme
  }, [theme])
}

function getInitialState<T extends keyof TStore>(key: T): TStoreProp<T> {
  return INITIAL_STORE[key][0]
}
