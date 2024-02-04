import { autocompletion, Completion, CompletionContext } from '@codemirror/autocomplete'
import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useRemoveRootLoader, useWindowsSize } from 'hook/util'
import { fetchAlgoValue } from 'lib/mobius'
import { deserialize } from 'lib/slate/deserialization'
import { createBlockNode } from 'lib/slate/util'
import {
  cn,
  getAlgoCompletionList,
  getBaseJsCompletion,
  getCodeStore,
  getDOM,
  prettier,
  updateCompletionList,
} from 'lib/util'
import { ChevronDown, Cog, Settings2 } from 'lucide-react'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import { BREAK_POINT } from 'react/constant'
import { useStore } from 'react/Store'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from 'shadcn/Dropdown'
import { toast } from 'sonner'
import { TLanguage, TSetState } from 'type/common'
import { TNormalizedSection } from 'type/data'
import { TSlateEditor } from 'type/slate'

//
// ─── TYPE DEFINITIONS ───────────────────────────────────────────────────────────
//

type TCodeEditorProps = { language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS' }
type TUseFormatOnLoadProps = {
  algorithm: string
  css: string
  html: string
  js: string
  setAlgorithm: TSetState<string>
  setCSS: TSetState<string>
  setHTML: TSetState<string>
  setJS: TSetState<string>
}
type THandleChangeParam = {
  codeEditorRef: RefObject<HTMLDivElement>
  editor: TSlateEditor | null
  language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS'
  setCode: TSetState<string>
  setIsUnsaved: TSetState<boolean>
  setJsCompletion: TSetState<Completion[]>
  timeout?: number
  value: string
}

//
// ─── COMPONENTS ─────────────────────────────────────────────────────────────────
//

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()
  const { width } = useWindowsSize()
  const codeEditorRef = useRef<HTMLDivElement>(null)

  const [currentSection, setCurrentSection] = store.section
  const [algorithm, setAlgorithm] = store.algorithm
  const [html, setHTML] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}HTML`]
  const [css, setCSS] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}CSS`]
  const [js, setJS] = store[`${currentSection !== 'algorithm' ? currentSection : 'question'}JS`]

  const [_editingLanguage, _setEditingLanguage] = store.editingLanguage
  const [_jsAutoCompletionList, _setJsAutoCompletionList] = store.jsAutoCompletionList
  const [_theme] = store.theme
  const [, _setAlgorithmPreview] = store.algorithmPreview
  const [, _setIsUnsaved] = store.isUnsaved

  const getCustomComplete = useCustomComplete(
    language === 'ALGORITHM' ? getAlgoCompletionList() : _jsAutoCompletionList,
  )

  useResetCompletionList({
    html,
    section: currentSection,
    setJsCompletionList: _setJsAutoCompletionList,
  })
  useFormatOnLoad({ algorithm, css, html, js, setAlgorithm, setCSS, setHTML, setJS })
  useRemoveRootLoader()

  const editor =
    currentSection === 'authornotes'
      ? store.authornotesSlate[0]
      : currentSection === 'feedback'
        ? store.feedbackSlate[0]
        : currentSection === 'question'
          ? store.questionSlate[0]
          : null
  const lang =
    language === 'HTML'
      ? langs.html()
      : language === 'CSS'
        ? langs.css()
        : language === 'JS'
          ? langs.javascript()
          : langs.perl()
  const setCode = language === 'HTML' ? setHTML : language === 'CSS' ? setCSS : language === 'JS' ? setJS : setAlgorithm

  console.log(language, html, css, js)

  return (
    <div className="relative h-full">
      <div className="flex w-full items-center justify-between px-3">
        {width <= BREAK_POINT.md && language === 'ALGORITHM' ? (
          <Dropdown>
            <DropdownTrigger className="group flex items-center focus:outline-none">
              <div className="h-5 py-1 text-xs font-bold">ALGORITHM</div>
              <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
            </DropdownTrigger>
            <DropdownContent>
              {(['question', 'authornotes', 'algorithm', 'feedback'] as TNormalizedSection[]).map((_section) => (
                <DropdownItem
                  key={_section}
                  className={cn('my-1', _section === currentSection ? 'bg-accent' : '')}
                  onClick={() => setCurrentSection(_section)}
                >
                  {_section === 'authornotes'
                    ? 'Author Notes'
                    : _section === 'feedback'
                      ? 'Feedback'
                      : _section === 'algorithm'
                        ? 'Algorithm'
                        : 'Question'}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        ) : width < BREAK_POINT.md ? (
          <Dropdown>
            <DropdownTrigger className="group flex items-center focus:outline-none">
              <div className="h-5 py-1 text-xs font-bold">{_editingLanguage}</div>
              <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
            </DropdownTrigger>
            <DropdownContent>
              {(['HTML', 'CSS', 'JS'] as TLanguage[]).map((language) => (
                <DropdownItem
                  key={language}
                  className={cn('my-1', language === _editingLanguage ? 'bg-accent' : '')}
                  onClick={() => _setEditingLanguage(language)}
                >
                  {language}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        ) : (
          <div className="h-5 py-1 text-xs font-bold">{language}</div>
        )}
        <Dropdown>
          <DropdownTrigger className="mt-1 cursor-default rounded-sm p-2 hover:bg-accent focus:outline-none">
            <div>
              <Settings2 className="h-3 w-3" />
            </div>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem
              onClick={() => {
                prettier(getCodeStore(store, language)[0], language)
                  .then((result) => {
                    getCodeStore(store, language)[1](result)
                  })
                  .catch(() => (language !== 'ALGORITHM' ? toast(`Error: Invalid ${language}`) : null))
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
      <div
        ref={codeEditorRef}
        style={{ height: 'calc(100% - 2rem)' }}
      >
        <ReactCodeMirror
          className="h-full"
          theme={_theme === 'dark' ? copilot : githubLight}
          value={getCodeStore(store, language)[0]}
          extensions={
            language === 'JS'
              ? [lang, color, hyperLink, autocompletion({ override: [baseJsAutoComplete, getCustomComplete()] })]
              : language === 'ALGORITHM'
                ? [lang, color, hyperLink, autocompletion({ override: [getCustomComplete()] })]
                : [lang, color, hyperLink]
          }
          onChange={(value) =>
            handleChange({
              codeEditorRef,
              editor,
              language,
              setCode,
              setIsUnsaved: _setIsUnsaved,
              setJsCompletion: _setJsAutoCompletionList,
              value,
            })
          }
        />
      </div>
      {language === 'HTML' ? (
        <Cog
          className="absolute bottom-2 right-2 hidden h-4 w-4 animate-spin"
          id={'cog-spinner-html'}
        />
      ) : null}
    </div>
  )
}

//
// ─── CUSTOM HOOKS ───────────────────────────────────────────────────────────────
//

function useCustomComplete(completionList: Completion[]) {
  return useCallback(() => {
    return (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/)
      if (!word || (word.from == word?.to && !context.explicit)) return null
      return { from: word.from, options: completionList }
    }
  }, [completionList])
}

function useResetCompletionList({
  html,
  section,
  setJsCompletionList,
}: {
  html: string
  section: string
  setJsCompletionList: TSetState<Completion[]>
}) {
  useEffect(() => {
    updateCompletionList(html, 'JS', setJsCompletionList)
  }, [html, section, setJsCompletionList])
}

function useFormatOnLoad({ algorithm, css, html, js, setAlgorithm, setCSS, setHTML, setJS }: TUseFormatOnLoadProps) {
  useEffect(() => {
    prettier(algorithm, 'ALGORITHM')
      .then((_algorithm) => setAlgorithm(_algorithm))
      .catch(() => {})
    prettier(html, 'HTML')
      .then((_html) => setHTML(_html))
      .catch(() => {})
    prettier(css, 'CSS')
      .then((_css) => setCSS(_css))
      .catch(() => {})
    prettier(js, 'JS')
      .then((_js) => setJS(_js))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

//
// ─── UTILITY FUNCTIONS ──────────────────────────────────────────────────────────
//

function handleChange({
  codeEditorRef,
  editor,
  language,
  setCode,
  setIsUnsaved,
  setJsCompletion,
  timeout = 300,
  value,
}: THandleChangeParam) {
  if (codeEditorRef.current === document.activeElement?.parentElement?.parentElement?.parentElement?.parentElement) {
    document.querySelector('#cog-spinner-slate')?.classList.remove('hidden')
    if (window.debouncer) clearTimeout(window.debouncer)
    if (language === 'HTML')
      window.debouncer = setTimeout(() => {
        setIsUnsaved(true)
        setCode(value.trim())
        updateCompletionList(value, 'JS', setJsCompletion)
        const fragment = deserialize(getDOM('algorithm', value.trim()))
        if (editor) {
          editor.children = [createBlockNode({})]
          editor.children = fragment
        }
        document.querySelector('#cog-spinner-slate')?.classList.add('hidden')
      }, timeout)
  }
}

function baseJsAutoComplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word || (word.from == word?.to && !context.explicit)) return null
  return { from: word.from, options: getBaseJsCompletion() }
}
