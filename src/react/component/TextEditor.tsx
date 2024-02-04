import { Completion } from '@codemirror/autocomplete'
import { Slate } from 'lib/slate'
import { renderElement, renderLeaf } from 'lib/slate/renderer'
import { serialize } from 'lib/slate/serialization'
import { createBlockNode } from 'lib/slate/util'
import { cn, prettier, updateCompletionList } from 'lib/util'
import { Cog } from 'lucide-react'
import { RefObject, useRef } from 'react'
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
    authornotesSlateInitialValue,
    authornotesSlateReadOnly,
    feedbackHTML,
    feedbackSlate,
    feedbackSlateInitialValue,
    feedbackSlateReadOnly,
    isUnsaved,
    jsAutoCompletionList,
    questionHTML,
    questionSlate,
    questionSlateInitialValue,
    questionSlateReadOnly,
    section,
  } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentSection] = section

  const [_authornotesHTML, _setAuthornotesHTML] = authornotesHTML
  const [_authornotesSlate] = authornotesSlate
  const [_authornotesSlateReadOnly] = authornotesSlateReadOnly
  const [_feedbackHTML, _setFeedbackHTML] = feedbackHTML
  const [_feedbackSlate] = feedbackSlate
  const [_feedbackSlateReadOnly] = feedbackSlateReadOnly
  const [_questionHTML, _setQuestionHTML] = questionHTML
  const [_questionSlate] = questionSlate
  const [_questionSlateInitialValue] = questionSlateInitialValue
  const [_authornotesSlateInitialValue] = authornotesSlateInitialValue
  const [_feedbackSlateInitialValue] = feedbackSlateInitialValue
  const [_questionSlateReadOnly] = questionSlateReadOnly
  const [, _setIsUnsaved] = isUnsaved
  const [, _setJsAutoCompletionList] = jsAutoCompletionList

  const editors: { editor: TSlateEditor; readOnly: boolean; section: TStoreProp<'section'> }[] = [
    { editor: _questionSlate, readOnly: _questionSlateReadOnly, section: 'question' },
    { editor: _authornotesSlate, readOnly: _authornotesSlateReadOnly, section: 'authornotes' },
    { editor: _feedbackSlate, readOnly: _feedbackSlateReadOnly, section: 'feedback' },
  ]

  const setCodeValue =
    currentSection === 'authornotes'
      ? _setAuthornotesHTML
      : currentSection === 'feedback'
        ? _setFeedbackHTML
        : currentSection === 'question'
          ? _setQuestionHTML
          : null

  return (
    <div
      ref={containerRef}
      className="relative h-full"
    >
      {editors.map(({ editor, readOnly, section }) => (
        <Slate
          key={section}
          editor={editor}
          initialValue={
            section === 'authornotes'
              ? _authornotesSlateInitialValue
              : section === 'feedback'
                ? _feedbackSlateInitialValue
                : section === 'question'
                  ? _questionSlateInitialValue
                  : [createBlockNode({})]
          }
          onValueChange={(value) =>
            handleValueChange({
              containerRef,
              setCode: setCodeValue,
              setIsUnsaved: _setIsUnsaved,
              setJsCompletion: _setJsAutoCompletionList,
              value,
            })
          }
        >
          <div
            className={cn(
              'absolute left-0 top-0 hidden h-full w-full overflow-auto',
              section === currentSection && '!block',
            )}
          >
            <div className="sticky top-0 z-[1] w-full bg-white dark:bg-accent">
              <SlateMenu containerRef={containerRef} />
              <SlateToolbar />
            </div>
            <div className="print-editor">
              <Editable
                className="min-h-[30rem] p-6 focus:outline-none"
                readOnly={readOnly}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>

            <Cog
              className="absolute bottom-2 right-2 hidden h-4 w-4 animate-spin"
              id="cog-spinner-slate"
            />
          </div>
        </Slate>
      ))}
    </div>
  )
}

function handleValueChange({
  containerRef,
  setCode,
  setIsUnsaved,
  setJsCompletion,
  timeout = 300,
  value,
}: {
  containerRef: RefObject<HTMLDivElement>
  setCode: TSetState<string> | null
  setIsUnsaved: TSetState<boolean>
  setJsCompletion: TSetState<Completion[]>
  timeout?: number
  value: TValue
}) {
  if (containerRef.current === document.activeElement?.parentElement?.parentElement?.parentElement) {
    document.querySelector('#cog-spinner-html')?.classList.remove('hidden')
    if (window.debouncer) clearTimeout(window.debouncer)
    if (setCode)
      window.debouncer = setTimeout(() => {
        const html = serialize(value)
        updateCompletionList(html, 'JS', setJsCompletion)
        prettier(html, 'HTML').then((html) => setCode(html))
        setIsUnsaved(true)
        document.querySelector('#cog-spinner-html')?.classList.add('hidden')
      }, timeout)
  }
}
