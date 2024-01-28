import { cn } from 'lib/util'
import { useStore } from 'react/Store'
import { Editable, Slate } from 'slate-react'
import { TSlateEditor } from 'type/slate'
import { TStoreProp } from 'type/store'

import SlateToolbar from './slate/Toolbar'

export default function TextEditor() {
  const { authornotesSlate, feedbackSlate, questionSlate, section } = useStore()

  const [currentSection] = section
  const [questionEditor] = questionSlate
  const [authornotesEditor] = authornotesSlate
  const [feedbackEditor] = feedbackSlate
  const editors: { editor: TSlateEditor; section: TStoreProp<'section'> }[] = [
    { editor: questionEditor, section: 'question' },
    { editor: authornotesEditor, section: 'authornotes' },
    { editor: feedbackEditor, section: 'feedback' },
  ]

  return (
    <div className="relative h-full">
      {editors.map(({ editor, section }) => (
        <Slate
          key={section}
          editor={editor}
          initialValue={[{ children: [{ text: 'Hello' }] }]}
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
            <Editable className="min-h-[30rem] p-6 focus:outline-none" />
          </div>
        </Slate>
      ))}
    </div>
  )
}
