import { autocompletion, Completion, CompletionContext } from '@codemirror/autocomplete'
import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { fetchAlgoValue } from 'lib/mobius'
import { getAlgoCompletionList, getBaseJsCompletion, getCodeStore, prettier, updateJsCompletionList } from 'lib/util'
import { Cog, Settings2 } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useStore } from 'react/Store'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from 'shadcn/Dropdown'
import { TSetState } from 'type/common'
import { TStore } from 'type/store'

type TCodeEditorProps = { language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS' }
type TUseFormatOnLoadProps = {
  css: string
  html: string
  js: string
  setCSS: TSetState<string>
  setHTML: TSetState<string>
  setJS: TSetState<string>
}

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()

  const [currentSection] = store.section
  const [html, setHTML] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}HTML`]
  const [css, setCSS] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}CSS`]
  const [js, setJS] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}JS`]

  const [_jsAutoCompletionList, _setJsAutoCompletionList] = store.jsAutoCompletionList
  const [_theme] = store.theme
  const [, _setAlgorithmPreview] = store.algorithmPreview
  const [, _setIsUnsaved] = store.isUnsaved

  const getCustomComplete = useCustomComplete(
    language === 'ALGORITHM' ? getAlgoCompletionList() : _jsAutoCompletionList,
  )

  useResetJsCompletionList(currentSection, html, _setJsAutoCompletionList)
  useFormatOnLoad({ css, html, js, setCSS, setHTML, setJS })

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
    <div className="relative h-full">
      <div className="flex w-full items-center justify-between px-3">
        <div className="h-5 py-1 text-xs font-bold">{language}</div>
        <Dropdown>
          <DropdownTrigger className="mt-1 cursor-default rounded-sm p-2 hover:bg-accent focus:outline-none">
            <div>
              <Settings2 className="h-3 w-3" />
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem
              onClick={() => {
                prettier(getCodeStore(store, language)[0], language).then((result) =>
                  getCodeStore(store, language)[1](result),
                )
              }}
            >
              Format
            </DropdownItem>
            {language === 'ALGORITHM' ? (
              <DropdownItem
                onClick={() => {
                  fetchAlgoValue({
                    onSuccess: (value) => {
                      _setAlgorithmPreview(value)
                      document.querySelector('#cog-spinner-algo-preview')?.classList.remove('!block')
                    },
                    store,
                  })
                  document.querySelector('#cog-spinner-algo-preview')?.classList.add('!block')
                }}
              >
                Preview Variables
              </DropdownItem>
            ) : null}
          </DropdownContent>
        </Dropdown>
      </div>
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
        onChange={(value) => handleChange(store, value, language, _setJsAutoCompletionList, _setIsUnsaved)}
      />
      {language === 'HTML' ? (
        <Cog
          className="absolute bottom-2 right-2 hidden h-4 w-4 animate-spin"
          id={'cog-spinner-html'}
        />
      ) : null}
    </div>
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

function useFormatOnLoad({ css, html, js, setCSS, setHTML, setJS }: TUseFormatOnLoadProps) {
  useEffect(() => {
    prettier(html, 'HTML').then((_html) => setHTML(_html))
    prettier(css, 'CSS').then((_css) => setCSS(_css))
    prettier(js, 'JS').then((_js) => setJS(_js))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function handleChange(
  store: TStore,
  value: string,
  language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS',
  setCompletion: TSetState<Completion[]>,
  setIsUnsaved: TSetState<boolean>,
) {
  getCodeStore(store, language)[1](value)
  if (language === 'HTML') updateJsCompletionList(value, setCompletion)
  setIsUnsaved(true)
}

function baseJsAutoComplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from == word?.to && !context.explicit)) return null
  return { from: word.from, options: getBaseJsCompletion() }
}
