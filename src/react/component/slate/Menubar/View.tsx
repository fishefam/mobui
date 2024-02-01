import { fetchAlgoValue, joinMobiusData, previewLegacyDocument } from 'lib/mobius'
import { ReactEditor } from 'lib/slate'
import { serialize } from 'lib/slate/serialization'
import { Check, Eye, Fullscreen, Pencil, ReceiptText } from 'lucide-react'
import { RefObject, useState } from 'react'
import { useStore } from 'react/Store'
import { Button } from 'shadcn/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'shadcn/Dialog'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from 'shadcn/Menubar'
import { useSlateStatic } from 'slate-react'
import { TSetState } from 'type/common'
import { TSlateEditor, TValue } from 'type/slate'
import { TStore } from 'type/store'

type TViewMenuProps = { containerRef: RefObject<HTMLElement> }

export default function ViewMenu({ containerRef }: TViewMenuProps) {
  const editor = useSlateStatic()
  const store = useStore()
  const [html, setHTML] = useState('')
  const {
    algorithm,
    authornotesCSS,
    authornotesHTML,
    authornotesJS,
    feedbackCSS,
    feedbackHTML,
    feedbackJS,
    questionCSS,
    questionHTML,
    questionJS,
    questionName,
    section,
  } = store
  const [currentSection] = section

  const [_algorithm] = algorithm
  const [_authornotesHTML] = authornotesHTML
  const [_feedbackHTML] = feedbackHTML
  const [_questionHTML] = questionHTML
  const [_authornotesCSS] = authornotesCSS
  const [_feedbackCSS] = feedbackCSS
  const [_questionCSS] = questionCSS
  const [_authornotesJS] = authornotesJS
  const [_feedbackJS] = feedbackJS
  const [_questionJS] = questionJS
  const [_questionName] = questionName

  const [isEditorReadOnly, setIsEditorReadOnly] =
    currentSection !== 'algorithm' ? store[`${currentSection}SlateReadOnly`] : [true, () => {}]
  const ModeIcon = isEditorReadOnly ? Eye : Pencil

  const previewDialogTitle = currentSection.charAt(0).toUpperCase().concat(currentSection.slice(1))

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>
            <div className="flex items-start gap-3">
              <ModeIcon className="mt-[0.35rem] h-3 w-3" />
              Mode
            </div>
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem onClick={() => setIsEditorReadOnly(false)}>
              <div className="flex min-w-48 items-start justify-start gap-3">
                <Pencil className="mt-[0.35rem] h-3 w-3" />
                <div>
                  <h4 className="text-sm font-semibold">Editing</h4>
                  <p className="text-xs">Edit document directly</p>
                </div>
                {!isEditorReadOnly ? <Check className="h-5 w-5 self-center" /> : null}
              </div>
            </MenubarItem>
            <MenubarItem onClick={() => setIsEditorReadOnly(true)}>
              <div className="flex min-w-48 items-start justify-start gap-3">
                <Eye className="mt-[0.35rem] h-3 w-3" />
                <div>
                  <h4 className="text-sm font-semibold">Viewing</h4>
                  <p className="text-xs">Read or print final document</p>
                </div>
                {isEditorReadOnly ? <Check className="h-5 w-5 self-center" /> : null}
              </div>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem onClick={(event) => event.preventDefault()}>
          <Dialog>
            <DialogTrigger onClick={() => previewDocument(store, editor, setHTML)}>
              <div className="flex items-start gap-3">
                <ReceiptText className="mt-[0.35rem] h-3 w-3" />
                Preview Document
              </div>
            </DialogTrigger>
            <DialogContent
              forceMount
              className="h-[50vh] w-[50vw] max-w-[70vw]"
            >
              <DialogHeader>
                <DialogTitle>{previewDialogTitle} Preview</DialogTitle>
                <DialogDescription dangerouslySetInnerHTML={{ __html: html }} />
                <DialogFooter className="absolute bottom-8 right-8">
                  <Button
                    onClick={() =>
                      previewLegacyDocument({
                        algorithm: _algorithm,
                        authornotes: joinMobiusData('authornotes', _authornotesHTML, _authornotesCSS, _authornotesJS),
                        feedback: joinMobiusData('feedback', _feedbackHTML, _feedbackCSS, _feedbackJS),
                        question: joinMobiusData('question', _questionHTML, _questionCSS, _questionJS),
                        questionName: _questionName,
                      })
                    }
                  >
                    Preview in Legacy UI
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => handleFullscreen(editor, containerRef)}>
          <div className="flex items-start gap-3">
            <Fullscreen className="mt-[0.35rem] h-3 w-3" />
            Toggle Fullscreen
          </div>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function handleFullscreen(editor: TSlateEditor, containerRef: RefObject<HTMLElement>) {
  let isAlreadySet = false
  const classNames = ['!fixed', 'z-10', 'h-screen', 'bg-white', 'dark:bg-accent', 'w-screen', 'top-0', 'left-0']
  const element = containerRef.current
  if (!isAlreadySet && !element?.classList.contains('!fixed')) {
    element?.classList.add(...classNames)
    isAlreadySet = true
  }
  if (!isAlreadySet && element?.classList.contains('!fixed')) element.classList.remove(...classNames)
  ReactEditor.focus(editor)
}

function previewDocument(store: TStore, editor: TSlateEditor, setHTML: TSetState<string>) {
  fetchAlgoValue({
    onSuccess: (value) => {
      let html = serialize(editor.children as TValue)
      const entries = Object.entries(value).map(([key, { value }]) => ['\\$' + key, value])
      for (const [key, value] of entries) html = html.replace(new RegExp(key, 'g'), value)
      setHTML(html)
    },
    store,
  })
}
