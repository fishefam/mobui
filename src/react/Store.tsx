import { MathJaxBaseContext } from 'better-react-mathjax'
import { createContext, useContext, useEffect, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp, TTheme } from 'type/store'

import { INITIAL_STORE } from './constant'

//
// ─── CONTEXTS ───────────────────────────────────────────────────────────────────
//

/**
 * Main store context of the app
 */
const Store = createContext<TStore>(INITIAL_STORE)

//
// ─── CONTEXT PROVIDER COMPONENTS ────────────────────────────────────────────────
//

/**
 * Store Provider Component
 *
 * Description:
 * This component defines a React context provider for the application store.
 * The store holds various state values using the `useState` hook, initializing them with default values.
 * It also includes a custom hook `useThemeChange` to update the theme-related styles when the theme changes.
 *
 */
export default function StoreProvider(props: TProps) {
  const _mathjax = useContext(MathJaxBaseContext)

  const algoAutoCompletionList = useState(getInitialState('algoAutoCompletionList'))
  const algorithm = useState(getInitialState('algorithm'))
  const algorithmPreview = useState(getInitialState('algorithmPreview'))

  const authornotesCSS = useState(getInitialState('authornotesCSS'))
  const authornotesHTML = useState(getInitialState('authornotesHTML'))
  const authornotesJS = useState(getInitialState('authornotesJS'))
  const authornotesSlate = useState(getInitialState('authornotesSlate'))
  const authornotesSlateInitialValue = useState(getInitialState('authornotesSlateInitialValue'))
  const authornotesSlateReadOnly = useState(getInitialState('authornotesSlateReadOnly'))

  const feedbackCSS = useState(getInitialState('feedbackCSS'))
  const feedbackHTML = useState(getInitialState('feedbackHTML'))
  const feedbackJS = useState(getInitialState('feedbackJS'))
  const feedbackSlate = useState(getInitialState('feedbackSlate'))
  const feedbackSlateInitialValue = useState(getInitialState('feedbackSlateInitialValue'))
  const feedbackSlateReadOnly = useState(getInitialState('feedbackSlateReadOnly'))

  const questionCSS = useState(getInitialState('questionCSS'))
  const questionHTML = useState(getInitialState('questionHTML'))
  const questionJS = useState(getInitialState('questionJS'))
  const questionSlate = useState(getInitialState('questionSlate'))
  const questionSlateInitialValue = useState(getInitialState('questionSlateInitialValue'))
  const questionSlateReadOnly = useState(getInitialState('questionSlateReadOnly'))

  const editingLanguage = useState(getInitialState('editingLanguage'))
  const isUnsaved = useState(getInitialState('isUnsaved'))
  const jsAutoCompletionList = useState(getInitialState('jsAutoCompletionList'))
  const panelLayout = useState(getInitialState('panelLayout'))
  const questionName = useState(getInitialState('questionName'))
  const section = useState(getInitialState('section'))
  const theme = useState(getInitialState('theme'))
  const mathjax = useState(_mathjax)

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
        authornotesSlateInitialValue,
        authornotesSlateReadOnly,
        editingLanguage,
        feedbackCSS,
        feedbackHTML,
        feedbackJS,
        feedbackSlate,
        feedbackSlateInitialValue,
        feedbackSlateReadOnly,
        isUnsaved,
        jsAutoCompletionList,
        mathjax,
        panelLayout,
        questionCSS,
        questionHTML,
        questionJS,
        questionName,
        questionSlate,
        questionSlateInitialValue,
        questionSlateReadOnly,
        section,
        theme,
      }}
    />
  )
}

//
// ─── CUSTOM HOOKS ───────────────────────────────────────────────────────────────
//

/**
 * Custom Hook: useStore
 *
 * Description:
 * This hook allows components to access the application store using the `useContext` hook.
 * Components using this hook will have access to the state values defined in the StoreProvider.
 *
 */
export function useStore() {
  return useContext(Store)
}

/**
 * Custom Hook: useThemeChange
 *
 * Description:
 * This hook is responsible for updating theme-related styles when the theme changes.
 *
 */
function useThemeChange(theme: TTheme) {
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
  }, [theme])
}

//
// ─── UTILITY FUNCTION ───────────────────────────────────────────────────────────
//

/**
 * Function: getInitialState
 *
 * Description:
 * Helper function to retrieve the initial state value for a given key from INITIAL_STORE.
 *
 */
function getInitialState<T extends keyof TStore>(key: T): TStoreProp<T> {
  return INITIAL_STORE[key][0]
}
