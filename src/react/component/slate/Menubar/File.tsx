import { saveAs } from 'file-saver'
import { asBlob } from 'html-docx-js-typescript'
import { saveData } from 'lib/mobius'
import { serialize } from 'lib/slate/serialization'
import { formURL, join } from 'lib/util'
import { useState } from 'react'
import { useStore } from 'react/Store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shadcn/AlertDialog'
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
  const [showWarningEditDialog, setShowWarningExitDialog] = useState(false)

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
  const [_isUnsaved, _setIsUnsaved] = isUnsaved

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger className="text-xs">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <a href={formURL('content/addquestion')}>
              New Question <MenubarShortcut>⌘N</MenubarShortcut>
            </a>
          </MenubarItem>
          <MenubarItem
            onClick={() =>
              saveData({
                algorithm: _algorithm,
                authornotes: join('', _authornotesHTML, _authornotesCSS, _authornotesJS),
                feedback: join('', _feedbackHTML, _feedbackCSS, _feedbackJS),
                isPreview: false,
                onSuccess: () => _setIsUnsaved(true),
                question: join('', _questionHTML, _questionCSS, _questionJS),
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
                onClick={() =>
                  asBlob(getHTML(editor)).then((result) => saveAs(result as Blob, `${_questionName}.docx`))
                }
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
          <MenubarItem onClick={window.print}>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => (_isUnsaved ? setShowWarningExitDialog(true) : history.back())}>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <WarningExitDialog
        setShow={setShowWarningExitDialog}
        show={showWarningEditDialog}
      />
    </>
  )
}

function WarningExitDialog({ setShow, show }: { setShow: TSetState<boolean>; show: boolean }) {
  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>All unsaved editing will be lost</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={history.back}>Exit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function getHTML(editor: TSlateEditor) {
  return serialize(editor.children as TValue)
}
