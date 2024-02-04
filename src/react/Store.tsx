import { createContext, useContext, useEffect, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp, TTheme } from 'type/store'

import { INITIAL_STORE } from './constant'

/**
 * Main store context of the app
 */
const Store = createContext<TStore>(INITIAL_STORE)

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
  const algoAutoCompletionList = useState<TStoreProp<'algoAutoCompletionList'>>(getInitialState('algoAutoCompletionList'))
  const algorithm = useState<TStoreProp<'algorithm'>>(getInitialState('algorithm'))
  const algorithmPreview = useState<TStoreProp<'algorithmPreview'>>(getInitialState('algorithmPreview'))
  const authornotesCSS = useState<TStoreProp<'authornotesCSS'>>(getInitialState('authornotesCSS'))
  const authornotesHTML = useState<TStoreProp<'authornotesHTML'>>(getInitialState('authornotesHTML'))
  const authornotesJS = useState<TStoreProp<'authornotesJS'>>(getInitialState('authornotesJS'))
  const authornotesSlate = useState<TStoreProp<'authornotesSlate'>>(getInitialState('authornotesSlate'))
  const authornotesSlateInitialValue = useState<TStoreProp<'authornotesSlateInitialValue'>>(getInitialState('authornotesSlateInitialValue'))
  const authornotesSlateReadOnly = useState<TStoreProp<'authornotesSlateReadOnly'>>(getInitialState('authornotesSlateReadOnly'))
  const editingLanguage = useState<TStoreProp<'editingLanguage'>>(getInitialState('editingLanguage'))
  const feedbackCSS = useState<TStoreProp<'feedbackCSS'>>(getInitialState('feedbackCSS'))
  const feedbackHTML = useState<TStoreProp<'feedbackHTML'>>(getInitialState('feedbackHTML'))
  const feedbackJS = useState<TStoreProp<'feedbackJS'>>(getInitialState('feedbackJS'))
  const feedbackSlate = useState<TStoreProp<'feedbackSlate'>>(getInitialState('feedbackSlate'))
  const feedbackSlateInitialValue = useState<TStoreProp<'feedbackSlateInitialValue'>>(getInitialState('feedbackSlateInitialValue'))
  const feedbackSlateReadOnly = useState<TStoreProp<'feedbackSlateReadOnly'>>(getInitialState('feedbackSlateReadOnly'))
  const isUnsaved = useState<TStoreProp<'isUnsaved'>>(getInitialState('isUnsaved'))
  const jsAutoCompletionList = useState<TStoreProp<'jsAutoCompletionList'>>(getInitialState('jsAutoCompletionList'))
  const panelLayout = useState<TStoreProp<'panelLayout'>>(getInitialState('panelLayout'))
  const questionCSS = useState<TStoreProp<'questionCSS'>>(getInitialState('questionCSS'))
  const questionHTML = useState<TStoreProp<'questionHTML'>>(getInitialState('questionHTML'))
  const questionJS = useState<TStoreProp<'questionJS'>>(getInitialState('questionJS'))
  const questionName = useState<TStoreProp<'questionName'>>(getInitialState('questionName'))
  const questionSlate = useState<TStoreProp<'questionSlate'>>(getInitialState('questionSlate'))
  const questionSlateInitialValue = useState<TStoreProp<'questionSlateInitialValue'>>(getInitialState('questionSlateInitialValue'))
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
    const html = document.querySelector('html')!
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
    html.style.colorScheme = theme
  }, [theme])
}

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
