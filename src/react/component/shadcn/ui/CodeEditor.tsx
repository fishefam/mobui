import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useStore } from 'react/Store'
import { TStore, TStoreCodeKey } from 'type/store'

import { useTheme } from './ThemeProvider'

type TCodeEditorProps = { language: 'HTML' | 'CSS' | 'JS' }

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()
  const { theme } = useTheme()
  const lang =
    language === 'HTML' ? langs.html() : language === 'CSS' ? langs.css() : langs.javascript()

  return (
    <div className="grid grid-rows-[5%_auto]">
      <div className="px-3 py-1 text-xs font-bold">{language}</div>
      <ReactCodeMirror
        className="h-full"
        extensions={[lang, color, hyperLink]}
        theme={theme === 'dark' ? copilot : githubLight}
        value={getCodeStore(store, language)[0]}
        onChange={(value) => getCodeStore(store, language)[1](value)}
      />
    </div>
  )
}

function getCodeStore(store: TStore, language: 'HTML' | 'CSS' | 'JS') {
  return store[`${store.section[0]}${language}` as TStoreCodeKey]
}
