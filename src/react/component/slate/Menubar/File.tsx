import { saveAs } from 'file-saver'
import { asBlob } from 'html-docx-js-typescript'
import { serialize } from 'lib/slate/serialization'
import { RefObject } from 'react'
import { useStore } from 'react/Store'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from 'shadcn/Menubar'
import { useSlateStatic } from 'slate-react'
import { TSetState } from 'type/common'
import { TSlateEditor, TValue } from 'type/slate'
import { TStoreProp } from 'type/store'

type TSaveDataProps = {
  algorithm: TStoreProp<'algorithm'>
  authornotesHTML: TStoreProp<'authornotesHTML'>
  classId: string
  feedbackHTML: TStoreProp<'feedbackHTML'>
  questionHTML: TStoreProp<'questionHTML'>
  questionName: TStoreProp<'questionName'>
  setIsUnsaved: TSetState<TStoreProp<'isUnsaved'>>
}

type TFileMenuProps = { editorRef: RefObject<HTMLDivElement> }

export default function FileMenu({ editorRef }: TFileMenuProps) {
  const {
    algorithm,
    authornotesCSS,
    authornotesHTML,
    authornotesJS,
    feedbackCSS,
    feedbackHTML,
    feedbackJS,
    isUnsaved,
    questionCSS,
    questionHTML,
    questionJS,
    questionName,
  } = useStore()
  const editor = useSlateStatic()

  const [_algorithm] = algorithm
  const [_authornotesCSS] = authornotesCSS
  const [_authornotesHTML] = authornotesHTML
  const [_authornotesJS] = authornotesJS
  const [_feedbackCSS] = feedbackCSS
  const [_feedbackHTML] = feedbackHTML
  const [_feedbackJS] = feedbackJS
  const [_questionCSS] = questionCSS
  const [_questionHTML] = questionHTML
  const [_questionJS] = questionJS
  const [_questionName] = questionName
  const [, _setIsUnsaved] = isUnsaved

  const classId = localStorage.getItem('classId') ? (localStorage.getItem('classId') as string) : '#'

  return (
    <MenubarMenu>
      <MenubarTrigger className="text-xs">File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <a href={`/${classId}/content/addquestion`}>
            New Question <MenubarShortcut>⌘N</MenubarShortcut>
          </a>
        </MenubarItem>
        <MenubarItem
          onClick={() =>
            saveData({
              algorithm: _algorithm,
              authornotesHTML: _authornotesHTML,
              classId,
              feedbackHTML: _feedbackHTML,
              questionHTML: _questionHTML,
              questionName: _questionName,
              setIsUnsaved: _setIsUnsaved,
            })
          }
        >
          Save <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Download</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem
              onClick={() => asBlob(getHTML(editor)).then((result) => saveAs(result as Blob, `${_questionName}.docx`))}
            >
              Microsoft Word (.docx)
            </MenubarItem>
            <MenubarItem onClick={() => saveAs(getHTML(editor), `${_questionName}.html`)}>Page (.html)</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Language</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>Vietnamese</MenubarItem>
            <MenubarItem>English</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem
          onClick={() => {
            window.print()
          }}
        >
          Print... <MenubarShortcut>⌘P</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={exit}>Exit</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function getHTML(editor: TSlateEditor) {
  return serialize(editor.children as TValue)
}

function saveData({
  algorithm,
  authornotesHTML,
  classId,
  feedbackHTML,
  questionHTML,
  questionName,
  setIsUnsaved,
}: TSaveDataProps) {
  const formData = new FormData()
  formData.set('classId', classId)
  formData.set('adaptive', 'false')
  formData.set('name', questionName)
  formData.set('questionText', questionHTML)
  formData.set('editor', questionHTML)
  formData.set('authorNotes', authornotesHTML)
  formData.set('authorNotesEditor', authornotesHTML)
  formData.set('algorithm', algorithm)
  formData.set('comment', feedbackHTML)
  formData.set('commentEditor', feedbackHTML)
  formData.set('uid', '64798aae-e805-493e-8fe5-d47a56a50eed')
  formData.set('actionId', 'savedraft')
  formData.set('hasUnsavedQuestion', 'Unsaved changes to the current question will be lost.')
  formData.set('AntiCsrfToken', document.cookie.replace('AntiCsrfToken=', ''))
  const body = new URLSearchParams(formData as unknown as URLSearchParams).toString()
  fetch('https://mohawk-math.mobius.cloud/qbeditor/SaveDynamicInline.do', {
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  }).catch((err) => console.log(err))
  setIsUnsaved(false)
}

function exit() {
  history.back()
}
