import { saveAs } from 'file-saver'
import { asBlob } from 'html-docx-js-typescript'
import { saveData } from 'lib/mobius'
import { serialize } from 'lib/slate/serialization'
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
import { TSlateEditor, TValue } from 'type/slate'

export default function FileMenu() {
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
              callback: () => _setIsUnsaved(true),
              classId,
              feedbackHTML: _feedbackHTML,
              isPreview: false,
              questionHTML: _questionHTML,
              questionName: _questionName,
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

function exit() {
  history.back()
}
