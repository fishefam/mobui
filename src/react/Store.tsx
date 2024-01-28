import { createSlateEditor } from 'lib/slate'
import { getLocalStorageItem } from 'lib/util'
import { createContext, useContext, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp } from 'type/store'

const PLACEHOLDER = () => {}
const INITIAL_STORE: TStore = {
  algorithm: ['', PLACEHOLDER],
  algorithmPreview: [{}, PLACEHOLDER],
  authornotesCSS: ['', PLACEHOLDER],
  authornotesHTML: ['', PLACEHOLDER],
  authornotesJS: ['', PLACEHOLDER],
  authornotesSlate: [createSlateEditor(), PLACEHOLDER],
  feedbackCSS: ['', PLACEHOLDER],
  feedbackHTML: ['', PLACEHOLDER],
  feedbackJS: ['', PLACEHOLDER],
  feedbackSlate: [createSlateEditor(), PLACEHOLDER],
  questionCSS: ['', PLACEHOLDER],
  questionHTML: ['', PLACEHOLDER],
  questionJS: ['', PLACEHOLDER],
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', PLACEHOLDER],
  questionSlate: [createSlateEditor(), PLACEHOLDER],
  section: ['question', PLACEHOLDER],
}

const Store = createContext<TStore>(INITIAL_STORE)

export default function StoreProvider(props: TProps) {
  const algorithm = useState<TStoreProp<'algorithm'>>(getInitialState('algorithm'))
  const algorithmPreview = useState<TStoreProp<'algorithmPreview'>>(getInitialState('algorithmPreview'))
  const authornotesCSS = useState<TStoreProp<'authornotesCSS'>>(getInitialState('authornotesCSS'))
  const authornotesHTML = useState<TStoreProp<'authornotesHTML'>>(getInitialState('authornotesHTML'))
  const authornotesJS = useState<TStoreProp<'authornotesJS'>>(getInitialState('authornotesJS'))
  const authornotesSlate = useState<TStoreProp<'authornotesSlate'>>(getInitialState('authornotesSlate'))
  const feedbackCSS = useState<TStoreProp<'feedbackCSS'>>(getInitialState('feedbackCSS'))
  const feedbackHTML = useState<TStoreProp<'feedbackHTML'>>(getInitialState('feedbackHTML'))
  const feedbackJS = useState<TStoreProp<'feedbackJS'>>(getInitialState('feedbackJS'))
  const feedbackSlate = useState<TStoreProp<'feedbackSlate'>>(getInitialState('feedbackSlate'))
  const questionCSS = useState<TStoreProp<'questionCSS'>>(getInitialState('questionCSS'))
  const questionHTML = useState<TStoreProp<'questionHTML'>>(getInitialState('questionHTML'))
  const questionJS = useState<TStoreProp<'questionJS'>>(getInitialState('questionJS'))
  const questionSlate = useState<TStoreProp<'questionSlate'>>(getInitialState('questionSlate'))
  const questionName = useState<TStoreProp<'questionName'>>(getInitialState('questionName'))
  const section = useState<TStoreProp<'section'>>(getInitialState('section'))

  return (
    <Store.Provider
      {...props}
      value={{
        algorithm,
        algorithmPreview,
        authornotesCSS,
        authornotesHTML,
        authornotesJS,
        authornotesSlate,
        feedbackCSS,
        feedbackHTML,
        feedbackJS,
        feedbackSlate,
        questionCSS,
        questionHTML,
        questionJS,
        questionName,
        questionSlate,
        section,
      }}
    />
  )
}

export function useStore() {
  return useContext(Store)
}

function getInitialState<T extends keyof TStore>(key: T): TStoreProp<T> {
  return INITIAL_STORE[key][0]
}
