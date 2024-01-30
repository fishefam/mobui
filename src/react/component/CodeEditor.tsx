import { autocompletion, Completion, CompletionContext } from '@codemirror/autocomplete'
import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { getBaseJsCompletion, updateCompletionList } from 'lib/util'
import { useCallback } from 'react'
import { useStore } from 'react/Store'
import { TSetState } from 'type/common'
import { TStore, TStoreCodeKey } from 'type/store'

type TCodeEditorProps = { language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS' }

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()
  const { autoCompletionList, theme } = useStore()
  const [_theme] = theme
  const [_autoCompletionList, _setAutoCompletionList] = autoCompletionList

  const getCustomComplete = useCustomComplete(_autoCompletionList)

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
            ? [lang, color, hyperLink, autocompletion({ override: [baseAutoComplete, getCustomComplete()] })]
            : [lang, color, hyperLink]
        }
        onChange={(value) => handleChange(store, value, language, _setAutoCompletionList)}
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

function handleChange(
  store: TStore,
  value: string,
  language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS',
  setCompletion: TSetState<Completion[]>,
) {
  getCodeStore(store, language)[1](value)
  if (language === 'HTML') updateCompletionList(value, setCompletion)
}

export function getCodeStore(store: TStore, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS') {
  return store[`${store.section[0]}${language !== 'ALGORITHM' ? language : ''}` as TStoreCodeKey]
}

function baseAutoComplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from == word?.to && !context.explicit)) return null
  return { from: word.from, options: getBaseJsCompletion() }
}
