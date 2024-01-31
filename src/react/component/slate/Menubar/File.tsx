import { saveAs } from 'file-saver'
import { asBlob } from 'html-docx-js-typescript'
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
  const { questionName } = useStore()
  const editor = useSlateStatic()

  const [_questionName] = questionName
  const classId = localStorage.getItem('classId') ? localStorage.getItem('classId') : '#'

  return (
    <MenubarMenu>
      <MenubarTrigger className="text-xs">File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <a href={`/${classId}/content/addquestion`}>
            New Question <MenubarShortcut>⌘N</MenubarShortcut>
          </a>
        </MenubarItem>
        <MenubarItem>
          Save <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Share</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>Email link</MenubarItem>
            <MenubarItem>Messages</MenubarItem>
            <MenubarItem>Notes</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
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
        <MenubarItem>
          Print... <MenubarShortcut>⌘P</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Exit</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function getHTML(editor: TSlateEditor) {
  return serialize(editor.children as TValue)
}
