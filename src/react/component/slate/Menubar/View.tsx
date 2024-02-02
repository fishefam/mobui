import { getLocalStorage } from 'lib/data'
import { createElement } from 'lib/dom'
import { fetchAlgoValue, joinMobiusData, previewLegacyDocument } from 'lib/mobius'
import { ReactEditor } from 'lib/slate'
import { cn } from 'lib/util'
import { Check, Eye, Fullscreen, Pencil, ReceiptText, X } from 'lucide-react'
import { RefObject, useEffect, useState } from 'react'
import { useStore } from 'react/Store'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Separator } from 'shadcn/Separator'
import { Tabs, TabsList, TabsTrigger } from 'shadcn/Tabs'
import { useSlateStatic } from 'slate-react'
import { TSetState } from 'type/common'
import { TSlateEditor } from 'type/slate'
import { TStore } from 'type/store'

type TViewMenuProps = { containerRef: RefObject<HTMLElement> }

export default function ViewMenu({ containerRef }: TViewMenuProps) {
  const editor = useSlateStatic()
  const store = useStore()
  const [questionDocument, setQuestionDocument] = useState('')
  const [feedbackDocument, setFeedbackDocument] = useState('')
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

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

  return (
    <>
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
          <MenubarItem
            disabled={currentSection === 'authornotes'}
            onClick={() => {
              previewDocument({
                section: currentSection as 'question',
                setFeedbackDocument,
                setQuestionDocument,
                store,
              })
              setShowPreviewDialog(true)
            }}
          >
            <div className="flex items-start gap-3">
              <ReceiptText className="mt-[0.35rem] h-3 w-3" />
              Preview Document
            </div>
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
      <PreviewDialog
        feedbackDocument={feedbackDocument}
        questionDocument={questionDocument}
        setFeedbackDocument={setFeedbackDocument}
        setQuestionDocument={setQuestionDocument}
        setShow={setShowPreviewDialog}
        show={showPreviewDialog}
      />
    </>
  )
}

function PreviewDialog({
  feedbackDocument,
  questionDocument,
  setFeedbackDocument,
  setQuestionDocument,
  setShow,
  show,
}: {
  feedbackDocument: string
  questionDocument: string
  setFeedbackDocument: TSetState<string>
  setQuestionDocument: TSetState<string>
  setShow: TSetState<boolean>
  show: boolean
}) {
  const store = useStore()
  const [showQuestion, setShowQuestion] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

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

  useEffect(() => {
    if (currentSection === 'question') {
      setShowQuestion(true)
      setShowFeedback(false)
    }
    if (currentSection === 'feedback') {
      setShowQuestion(false)
      setShowFeedback(true)
    }
  }, [currentSection])

  return (
    <Dialog open={show}>
      <DialogContent
        forceMount
        className="h-[50vh] w-[50vw] max-w-[70vw]"
      >
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <div className="max-h-[50vh] overflow-auto">
            <div className={cn('py-4', showQuestion ? 'block' : 'hidden')}>
              <h4 className="mb-2">Question</h4>
              <Separator dir="horizontal" />
              <DialogDescription dangerouslySetInnerHTML={{ __html: questionDocument }} />
            </div>
            <div className={cn('py-4', showFeedback ? 'block' : 'hidden')}>
              <h4 className="mb-2">Feedback</h4>
              <Separator dir="horizontal" />
              <DialogDescription dangerouslySetInnerHTML={{ __html: feedbackDocument }} />
            </div>
          </div>
          <DialogFooter className="absolute bottom-8 right-8">
            <Tabs className="w-full">
              <TabsList className="w-full justify-evenly gap-1 bg-transparent">
                {(['Question', 'Feedback', 'Both', 'Legacy UI'] as const).map((layout) => (
                  <TabsTrigger
                    key={layout}
                    autoFocus={currentSection === layout.toLocaleLowerCase()}
                    value={layout}
                    className={cn(
                      'h-full w-full py-2 data-[state=active]:shadow-none hover:bg-accent',
                      layout === 'Legacy UI' && 'data-[state=active]:text-muted',
                      layout !== 'Legacy UI' && 'data-[state=active]:bg-accent data-[state=active]:text-foreground',
                    )}
                    onClick={() => {
                      if (layout === 'Question') {
                        previewDocument({ section: 'question', setFeedbackDocument, setQuestionDocument, store })
                        setShowQuestion(true)
                        setShowFeedback(false)
                      }
                      if (layout === 'Feedback') {
                        previewDocument({ section: 'feedback', setFeedbackDocument, setQuestionDocument, store })
                        setShowQuestion(false)
                        setShowFeedback(true)
                      }
                      if (layout === 'Both') {
                        previewDocument({ section: 'both', setFeedbackDocument, setQuestionDocument, store })
                        setShowFeedback(true)
                        setShowQuestion(true)
                      }
                      if (layout === 'Legacy UI')
                        previewLegacyDocument({
                          algorithm: _algorithm,
                          authornotes: joinMobiusData('authornotes', _authornotesHTML, _authornotesCSS, _authornotesJS),
                          feedback: joinMobiusData('feedback', _feedbackHTML, _feedbackCSS, _feedbackJS),
                          question: joinMobiusData('question', _questionHTML, _questionCSS, _questionJS),
                          questionName: _questionName,
                        })
                    }}
                  >
                    {layout === 'Legacy UI'
                      ? `Legacy UI: ${currentSection === 'question' ? 'Question' : 'Feedback'}`
                      : layout}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </DialogFooter>
        </DialogHeader>
        <DialogClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => setShow(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
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

function previewDocument({
  section,
  setFeedbackDocument,
  setQuestionDocument,
  store,
}: {
  section: 'both' | 'feedback' | 'question'
  setFeedbackDocument: TSetState<string>
  setQuestionDocument: TSetState<string>
  store: TStore
}) {
  fetchAlgoValue({
    onSuccess: (value) => {
      const { feedbackCSS, feedbackHTML, feedbackJS, questionCSS, questionHTML, questionJS } = store

      const [_feedbackCSS] = feedbackCSS
      const [_feedbackHTML] = feedbackHTML
      const [_feedbackJS] = feedbackJS
      const [_questionCSS] = questionCSS
      const [_questionHTML] = questionHTML
      const [_questionJS] = questionJS

      const question = joinMobiusData('question', _questionHTML, _questionCSS, _questionJS)
      const feedback = joinMobiusData('feedback', _feedbackHTML, _feedbackCSS, _feedbackJS)

      const scripts = [
        { html: question, js: _questionJS, setHTML: setQuestionDocument },
        { html: feedback, js: _feedbackJS, setHTML: setFeedbackDocument },
      ]
        .map(({ html, js, setHTML }) => {
          const entries = Object.entries(value).map(([key, { value }]) => ['\\$' + key, value])
          for (const [key, value] of entries) html = html.replace(new RegExp(key, 'g'), value)
          setHTML(html)
          return createElement({ tag: 'script', text: `{${js}}` })
        })
        .map((script, i) => ({ element: script, section: i === 0 ? ('question' as const) : ('feedback' as const) }))

      const parent = document.querySelector(`#${getLocalStorage().scriptContainerId}`)!
      parent.innerHTML = ''

      scripts.forEach(({ element, section: _section }) => {
        if (section === _section || section === 'both') parent.appendChild(element)
      })
    },
    store,
  })
}
