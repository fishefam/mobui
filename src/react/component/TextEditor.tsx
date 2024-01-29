import { Slate } from 'lib/slate'
import { renderElement, renderLeaf } from 'lib/slate/renderer'
import { cn } from 'lib/util'
import { useEffect } from 'react'
import { useStore } from 'react/Store'
import { Editable, ReactEditor } from 'slate-react'
import { TSlateEditor } from 'type/slate'
import { TStoreProp } from 'type/store'

import SlateToolbar from './slate/Toolbar'

export default function TextEditor() {
  const {
    authornotesSlate,
    authornotesSlateReadOnly,
    feedbackSlate,
    feedbackSlateReadOnly,
    questionSlate,
    questionSlateReadOnly,
    section,
  } = useStore()

  const [currentSection] = section
  const [questionEditor] = questionSlate
  const [authornotesEditor] = authornotesSlate
  const [feedbackEditor] = feedbackSlate
  const [questionReadOnly] = questionSlateReadOnly
  const [authornotesReadOnly] = authornotesSlateReadOnly
  const [feedbackReadOnly] = feedbackSlateReadOnly
  const editors: { editor: TSlateEditor; readOnly: boolean; section: TStoreProp<'section'> }[] = [
    { editor: questionEditor, readOnly: questionReadOnly, section: 'question' },
    { editor: authornotesEditor, readOnly: authornotesReadOnly, section: 'authornotes' },
    { editor: feedbackEditor, readOnly: feedbackReadOnly, section: 'feedback' },
  ]

  useEffect(() => ReactEditor.focus(questionEditor), [questionEditor])

  return (
    <div className="relative h-full">
      {editors.map(({ editor, readOnly, section }) => (
        <Slate
          key={section}
          editor={editor}
          initialValue={[{ attributes: {}, children: [{ text: section }], id: '', style: {}, type: 'paragraph' }]}
        >
          <div
            className={cn(
              'absolute left-0 top-0 hidden h-full w-full overflow-auto',
              section === currentSection && '!block',
            )}
          >
            <div className="sticky top-0 z-10 w-full bg-white dark:bg-accent">
              <SlateToolbar />
            </div>
            <Editable
              className="min-h-[30rem] p-6 focus:outline-none"
              readOnly={readOnly}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
            />
          </div>
        </Slate>
      ))}
    </div>
  )
}
