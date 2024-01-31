import { autocompletion, Completion, CompletionContext } from '@codemirror/autocomplete'
import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { getAlgoCompletionList, getBaseJsCompletion, updateJsCompletionList } from 'lib/util'
import { useCallback, useEffect } from 'react'
import { useStore } from 'react/Store'
import { TSetState } from 'type/common'
import { TStore, TStoreCodeKey } from 'type/store'

type TCodeEditorProps = { language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS' }

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()

  const [currentSection] = store.section
  const [html] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}HTML`]

  const [_theme] = store.theme
  const [_jsAutoCompletionList, _setJsAutoCompletionList] = store.jsAutoCompletionList

  const getCustomComplete = useCustomComplete(
    language === 'ALGORITHM' ? getAlgoCompletionList() : _jsAutoCompletionList,
  )

  useResetJsCompletionList(currentSection, html, _setJsAutoCompletionList)

  const lang =
    language === 'HTML'
      ? langs.html()
      : language === 'CSS'
        ? langs.css()
        : language === 'JS'
          ? langs.javascript()
          : langs.perl()
  const placeholder =
    language === 'HTML'
      ? '<div>Mobius</div>'
      : language === 'CSS'
        ? '#Mobius { color: violet; }'
        : language === 'JS'
          ? 'console.log("Mobius");'
          : "$my_var = 'Mobius';"

  return (
    <>
      <div className="h-5 px-3 py-1 text-xs font-bold">{language}</div>
      <ReactCodeMirror
        placeholder={placeholder}
        style={{ height: 'calc(100% - 1.25rem)' }}
        theme={_theme === 'dark' ? copilot : githubLight}
        value={getCodeStore(store, language)[0]}
        extensions={
          language === 'JS'
            ? [lang, color, hyperLink, autocompletion({ override: [baseJsAutoComplete, getCustomComplete()] })]
            : language === 'ALGORITHM'
              ? [lang, color, hyperLink, autocompletion({ override: [getCustomComplete()] })]
              : [lang, color, hyperLink]
        }
        onChange={(value) => handleChange(store, value, language, _setJsAutoCompletionList)}
      />
    </>
  )
}

function useCustomComplete(completionList: Completion[]) {
  return useCallback(() => {
    return (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/)
      if (!word || (word.from == word?.to && !context.explicit)) return null
      return { from: word.from, options: completionList }
    }
  }, [completionList])
}

function useResetJsCompletionList(section: string, html: string, setCompletionList: TSetState<Completion[]>) {
  useEffect(() => updateJsCompletionList(html, setCompletionList), [html, section, setCompletionList])
}

function handleChange(
  store: TStore,
  value: string,
  language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS',
  setCompletion: TSetState<Completion[]>,
) {
  getCodeStore(store, language)[1](value)
  if (language === 'HTML') updateJsCompletionList(value, setCompletion)
}

export function getCodeStore(store: TStore, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS') {
  return store[`${store.section[0]}${language !== 'ALGORITHM' ? language : ''}` as TStoreCodeKey]
}

function baseJsAutoComplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from == word?.to && !context.explicit)) return null
  return { from: word.from, options: getBaseJsCompletion() }
}
