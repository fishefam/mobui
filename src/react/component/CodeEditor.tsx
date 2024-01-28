import { color } from '@uiw/codemirror-extensions-color'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { langs } from '@uiw/codemirror-extensions-langs'
import { copilot, githubLight } from '@uiw/codemirror-themes-all'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useStore } from 'react/Store'
import { TStore, TStoreCodeKey } from 'type/store'

import { useTheme } from './shadcn/ui/ThemeProvider'

type TCodeEditorProps = { language: 'HTML' | 'CSS' | 'JS' | 'ALGORITHM' }

export default function CodeEditor({ language }: TCodeEditorProps) {
  const store = useStore()
  const { theme } = useTheme()
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
        extensions={[lang, color, hyperLink]}
        placeholder={placeholder}
        style={{ height: 'calc(100% - 1.25rem)' }}
        theme={theme === 'dark' ? copilot : githubLight}
        value={getCodeStore(store, language)[0]}
        onChange={(value) => getCodeStore(store, language)[1](value)}
      />
    </>
  )
}

export function getCodeStore(store: TStore, language: 'HTML' | 'CSS' | 'JS' | 'ALGORITHM') {
  return store[`${store.section[0]}${language !== 'ALGORITHM' ? language : ''}` as TStoreCodeKey]
}
