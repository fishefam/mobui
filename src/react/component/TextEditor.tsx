import { useState } from 'react'
import { useStore } from 'react/Store'
import { BaseEditor, createEditor, Descendant } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { TSetState } from 'type/common'

export default function TextEditor() {
  const { section } = useStore()
  const [currentSection] = section

  const [questionEditor] = useState(() => withReact(createEditor()))
  const [authornotesEditor] = useState(() => withReact(createEditor()))
  const [feedbackEditor] = useState(() => withReact(createEditor()))
  const [questionValue, setQuestionValue] = useState([{ children: [{ text: 'Hello Question' }] }])
  const [authornotesValue, setAuthornotesValue] = useState([
    { children: [{ text: 'Hello Author Notes' }] },
  ])
  const [feedbackValue, setFeedbackValue] = useState([{ children: [{ text: 'Hello Feedback' }] }])

  const editor: {
    editor: BaseEditor & ReactEditor
    setValue: TSetState<Descendant[]>
    value: Descendant[]
  } | null =
    currentSection === 'question'
      ? { editor: questionEditor, setValue: setQuestionValue, value: questionValue }
      : currentSection === 'authornotes'
        ? { editor: authornotesEditor, setValue: setAuthornotesValue, value: authornotesValue }
        : currentSection === 'feedback'
          ? { editor: feedbackEditor, setValue: setFeedbackValue, value: feedbackValue }
          : null

  return (
    <div className="flex h-full items-center justify-center p-6">
      {editor ? (
        <Slate
          editor={editor.editor}
          initialValue={editor.value}
          onValueChange={(value) => editor.setValue(value)}
        >
          <Editable />
        </Slate>
      ) : null}
    </div>
  )
}
