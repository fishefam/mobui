import { Completion } from '@codemirror/autocomplete'
import { Slate } from 'lib/slate'
import { renderElement, renderLeaf } from 'lib/slate/renderer'
import { serialize } from 'lib/slate/serialization'
import { createBlockNode } from 'lib/slate/util'
import { cn, prettierSync, updateJsCompletionList } from 'lib/util'
import { useRef } from 'react'
import { useStore } from 'react/Store'
import { Editable } from 'slate-react'
import { TSetState } from 'type/common'
import { TSlateEditor, TValue } from 'type/slate'
import { TStoreProp } from 'type/store'

import SlateMenu from './slate/Menubar'
import SlateToolbar from './slate/Toolbar'

export default function TextEditor() {
  const {
    authornotesHTML,
    authornotesSlate,
    authornotesSlateReadOnly,
    feedbackHTML,
    feedbackSlate,
    feedbackSlateReadOnly,
    isUnsaved,
    jsAutoCompletionList,
    questionHTML,
    questionSlate,
    questionSlateReadOnly,
    section,
  } = useStore()

  const [currentSection] = section

  const [_authornotesSlate] = authornotesSlate
  const [_authornotesSlateReadOnly] = authornotesSlateReadOnly
  const [_feedbackSlate] = feedbackSlate
  const [_feedbackSlateReadOnly] = feedbackSlateReadOnly
  const [_questionSlate] = questionSlate
  const [_questionSlateReadOnly] = questionSlateReadOnly
  const [, _setjsAutoCompletionList] = jsAutoCompletionList
  const [, _setIsUnsaved] = isUnsaved

  const contrainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const editors: { editor: TSlateEditor; readOnly: boolean; section: TStoreProp<'section'> }[] = [
    { editor: _questionSlate, readOnly: _questionSlateReadOnly, section: 'question' },
    { editor: _authornotesSlate, readOnly: _authornotesSlateReadOnly, section: 'authornotes' },
    { editor: _feedbackSlate, readOnly: _feedbackSlateReadOnly, section: 'feedback' },
  ]

  const setCodeValue =
    currentSection === 'authornotes'
      ? authornotesHTML[1]
      : currentSection === 'feedback'
        ? feedbackHTML[1]
        : currentSection === 'question'
          ? questionHTML[1]
          : null

  return (
    <div
      ref={contrainerRef}
      className="relative h-full"
    >
      {editors.map(({ editor, readOnly, section }) => (
        <Slate
          key={section}
          editor={editor}
          initialValue={[createBlockNode({ text: section, type: 'paragraph' })]}
          onValueChange={(value) => handleValueChange(value, _setIsUnsaved, _setjsAutoCompletionList, setCodeValue)}
        >
          <div
            className={cn(
              'absolute left-0 top-0 hidden h-full w-full overflow-auto',
              section === currentSection && '!block',
            )}
          >
            <div className="sticky top-0 z-[0] w-full bg-white dark:bg-accent">
              <SlateMenu
                containerRef={contrainerRef}
                editorRef={editorRef}
              />
              <SlateToolbar />
            </div>
            <div
              ref={editorRef}
              className="print-editor"
            >
              <Editable
                className="min-h-[30rem] p-6 focus:outline-none"
                readOnly={readOnly}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>
          </div>
        </Slate>
      ))}
    </div>
  )
}

function handleValueChange(
  value: TValue,
  setIsUnsaved: TSetState<boolean>,
  setCompletion: TSetState<Completion[]>,
  setCode: TSetState<string> | null,
  timeout = 300,
) {
  if (window.debouncer) clearTimeout(window.debouncer)
  if (setCode)
    window.debouncer = setTimeout(() => {
      const html = serialize(value)
      updateJsCompletionList(html, setCompletion)
      setCode(prettierSync(html, 'html'))
      setIsUnsaved(true)
    }, timeout)
}
