import { getLocalStorageItem } from 'lib/util'
import { createContext, useContext, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp } from 'type/store'

const PLACEHOLDER = () => {}
const INITIAL_STORE: TStore = {
  algorithmCSS: ['', PLACEHOLDER],
  algorithmHTML: ['', PLACEHOLDER],
  algorithmJS: ['', PLACEHOLDER],
  authornotesCSS: ['', PLACEHOLDER],
  authornotesHTML: ['', PLACEHOLDER],
  authornotesJS: ['', PLACEHOLDER],
  feedbackCSS: ['', PLACEHOLDER],
  feedbackHTML: ['', PLACEHOLDER],
  feedbackJS: ['', PLACEHOLDER],
  questionCSS: ['', PLACEHOLDER],
  questionHTML: ['', PLACEHOLDER],
  questionJS: ['', PLACEHOLDER],
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', PLACEHOLDER],
  section: ['question', PLACEHOLDER],
}

const Store = createContext<TStore>(INITIAL_STORE)

export default function StoreProvider(props: TProps) {
  const section = useState<TStoreProp<'section'>>(getInitialState('section'))
  const questionName = useState<TStoreProp<'questionName'>>(getInitialState('questionName'))
  const algorithmCSS = useState<TStoreProp<'algorithmCSS'>>(getInitialState('algorithmCSS'))
  const algorithmHTML = useState<TStoreProp<'algorithmHTML'>>(getInitialState('algorithmHTML'))
  const algorithmJS = useState<TStoreProp<'algorithmJS'>>(getInitialState('algorithmJS'))
  const authornotesCSS = useState<TStoreProp<'authornotesCSS'>>(getInitialState('authornotesCSS'))
  const authornotesHTML = useState<TStoreProp<'authornotesHTML'>>(
    getInitialState('authornotesHTML'),
  )
  const authornotesJS = useState<TStoreProp<'authornotesJS'>>(getInitialState('authornotesJS'))
  const feedbackCSS = useState<TStoreProp<'feedbackCSS'>>(getInitialState('feedbackCSS'))
  const feedbackHTML = useState<TStoreProp<'feedbackHTML'>>(getInitialState('feedbackHTML'))
  const feedbackJS = useState<TStoreProp<'feedbackJS'>>(getInitialState('feedbackJS'))
  const questionCSS = useState<TStoreProp<'questionCSS'>>(getInitialState('questionCSS'))
  const questionHTML = useState<TStoreProp<'questionHTML'>>(getInitialState('questionHTML'))
  const questionJS = useState<TStoreProp<'questionJS'>>(getInitialState('questionJS'))

  return (
    <Store.Provider
      {...props}
      value={{
        algorithmCSS,
        algorithmHTML,
        algorithmJS,
        authornotesCSS,
        authornotesHTML,
        authornotesJS,
        feedbackCSS,
        feedbackHTML,
        feedbackJS,
        questionCSS,
        questionHTML,
        questionJS,
        questionName,
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
