import { MathJax3Object } from 'better-react-mathjax'
import { createElement } from 'lib/dom'
import { fetchAlgoValue, joinMobiusData, previewLegacyDocument } from 'lib/mobius'
import { ReactEditor } from 'lib/slate'
import { cn, isRefObject } from 'lib/util'
import { Check, Eye, Fullscreen, Pencil, ReceiptText, X } from 'lucide-react'
import { ForwardedRef, forwardRef, RefObject, useEffect, useRef, useState } from 'react'
import { useStore } from 'react/Store'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'shadcn/Dialog'
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
import { TNormalizedSection } from 'type/data'
import { TSlateEditor } from 'type/slate'
import { TStore } from 'type/store'

type TComponent_ViewMenuProps = { containerRef: RefObject<HTMLElement> }
type TComponent_PreviewDialogProps = {
  feedbackDocument: string
  questionDocument: string
  setFeedbackDocument: TSetState<string>
  setQuestionDocument: TSetState<string>
  setShow: TSetState<boolean>
  show: boolean
}
type THook_PreviewContentParam = {
  feedback: string
  iframe: ForwardedRef<HTMLIFrameElement>
  question: string
  section: 'default-ui' | TNormalizedSection
}
type THandler_PreviewDocumentParam = {
  iframe: ForwardedRef<HTMLIFrameElement>
  section: 'both' | 'feedback' | 'question'
  setFeedback: TSetState<string>
  setQuestion: TSetState<string>
  store: TStore
}
type THandler_ChangePreviewSection = {
  iframe: ForwardedRef<HTMLIFrameElement>
  setFeedback: TSetState<string>
  setPreviewSection: TSetState<'default-ui' | TNormalizedSection>
  setQuestion: TSetState<string>
  store: TStore
  tab: TPreviewTab
}
type TPreviewTab = 'Default UI' | 'Feedback' | 'Question'

export default function ViewMenu({ containerRef }: TComponent_ViewMenuProps) {
  const editor = useSlateStatic()
  const store = useStore()
  const [questionDocument, setQuestionDocument] = useState('')
  const [feedbackDocument, setFeedbackDocument] = useState('')
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const {
    algorithm,
    authornotesCSS,
    authornotesHTML,
    authornotesJS,
    feedbackCSS,
    feedbackHTML,
    feedbackJS,
    mathjax,
    questionCSS,
    questionHTML,
    questionJS,
    questionName,
    section,
  } = store
  const [currentSection] = section

  const [_algorithm] = algorithm
  const [_authornotesCSS] = authornotesCSS
  const [_authornotesHTML] = authornotesHTML
  const [_authornotesJS] = authornotesJS
  const [_feedbackCSS] = feedbackCSS
  const [_feedbackHTML] = feedbackHTML
  const [_feedbackJS] = feedbackJS
  const [_mathjax] = mathjax
  const [_questionCSS] = questionCSS
  const [_questionHTML] = questionHTML
  const [_questionJS] = questionJS
  const [_questionName] = questionName

  const [isEditorReadOnly, setIsEditorReadOnly] =
    currentSection !== 'algorithm' ? store[`${currentSection}SlateReadOnly`] : [true, () => {}]

  const ModeIcon = isEditorReadOnly ? Eye : Pencil

  return (
    <div>
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
                iframe: iframeRef,
                section: currentSection as 'question',
                setFeedback: setFeedbackDocument,
                setQuestion: setQuestionDocument,
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
        ref={iframeRef}
        feedbackDocument={feedbackDocument}
        questionDocument={questionDocument}
        setFeedbackDocument={setFeedbackDocument}
        setQuestionDocument={setQuestionDocument}
        setShow={setShowPreviewDialog}
        show={showPreviewDialog}
      />
    </div>
  )
}

const PreviewDialog = forwardRef<HTMLIFrameElement, TComponent_PreviewDialogProps>(_PreviewDialog)
function _PreviewDialog(
  {
    feedbackDocument,
    questionDocument,
    setFeedbackDocument,
    setQuestionDocument,
    setShow,
    show,
  }: TComponent_PreviewDialogProps,
  iframeRef: ForwardedRef<HTMLIFrameElement>,
) {
  const store = useStore()
  const container = useRef<HTMLDivElement>(null)

  const [currentSection] = store.section

  const [_algorithm] = store.algorithm
  const [_authornotesHTML] = store.authornotesHTML
  const [_feedbackHTML] = store.feedbackHTML
  const [_questionHTML] = store.questionHTML
  const [_authornotesCSS] = store.authornotesCSS
  const [_feedbackCSS] = store.feedbackCSS
  const [_questionCSS] = store.questionCSS
  const [_authornotesJS] = store.authornotesJS
  const [_feedbackJS] = store.feedbackJS
  const [_questionJS] = store.questionJS
  const [_questionName] = store.questionName
  const [_mathjax] = store.mathjax

  const { previewSection, setPreviewSection } = usePreviewSection()
  useTypeset(iframeRef)
  usePreviewContent({
    feedback: feedbackDocument,
    iframe: iframeRef,
    question: questionDocument,
    section: previewSection,
  })

  return (
    <Dialog open={show}>
      <DialogContent
        ref={container}
        forceMount
        className="h-[80vh] w-[50vw] max-w-[70vw]"
      >
        <DialogHeader className="absolute w-full p-8">
          <DialogTitle>Preview</DialogTitle>

          {previewSection !== 'default-ui' ? (
            <>
              <h4 className="mb-2">{previewSection === 'question' ? 'Question' : 'Feedback'}</h4>
              <Separator dir="horizontal" />

              <iframe
                ref={iframeRef}
                className="h-80 overflow-auto break-words p-4"
              />
            </>
          ) : null}
        </DialogHeader>

        <DialogFooter className="absolute bottom-8 right-8">
          <Tabs className="w-full">
            <TabsList className="w-full justify-evenly gap-1 bg-transparent">
              {(['Question', 'Feedback', 'Default UI'] as TPreviewTab[]).map((tab) => (
                <TabsTrigger
                  key={tab}
                  autoFocus={currentSection === tab.toLocaleLowerCase()}
                  value={tab}
                  className={cn(
                    'h-full w-full py-2 data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:bg-accent',
                  )}
                  onClick={() =>
                    changePreviewSection({
                      iframe: iframeRef,
                      setFeedback: setFeedbackDocument,
                      setPreviewSection,
                      setQuestion: setQuestionDocument,
                      store,
                      tab,
                    })
                  }
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </DialogFooter>
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

function usePreviewSection() {
  const { section } = useStore()
  const [previewSection, setPreviewSection] = useState<'default-ui' | TNormalizedSection>(section[0])
  const [currentSection] = section
  useEffect(() => {
    if (currentSection === 'question') setPreviewSection('question')
    if (currentSection === 'feedback') setPreviewSection('feedback')
  }, [currentSection])
  return { previewSection, setPreviewSection }
}

function useTypeset(ref: ForwardedRef<HTMLIFrameElement>) {
  const { mathjax } = useStore()
  const [_mathjax] = mathjax
  useEffect(() => {
    if (_mathjax && isRefObject(ref))
      _mathjax.promise.then((mathJax) => {
        const mj = mathJax as MathJax3Object
        mj.startup.promise.then(() => {
          mj.typesetClear([ref.current!.contentWindow?.document.body])
          mj.typesetPromise([ref.current!.contentWindow?.document.body])
        })
      })
  })
}

function usePreviewContent({ feedback, iframe, question, section }: THook_PreviewContentParam) {
  useEffect(() => {
    if (isRefObject(iframe) && iframe.current) {
      iframe.current.contentWindow!.document.body.innerHTML = ''
      iframe.current.contentWindow!.document.write(section === 'question' ? question : feedback)
    }
  }, [feedback, iframe, question, section])
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

function previewDocument({ iframe, section, setFeedback, setQuestion, store }: THandler_PreviewDocumentParam) {
  const containerId = 'preview'
  fetchAlgoValue({
    onSuccess: (value) => {
      const { feedbackCSS, feedbackHTML, feedbackJS, questionCSS, questionHTML, questionJS } = store

      const [_feedbackCSS] = feedbackCSS
      const [_feedbackHTML] = feedbackHTML
      const [_feedbackJS] = feedbackJS
      const [_questionCSS] = questionCSS
      const [_questionHTML] = questionHTML
      const [_questionJS] = questionJS

      const question = joinMobiusData(
        'question',
        _questionHTML,
        `#${containerId} ` + _questionCSS.replace(/}/g, `}#${containerId} `),
        _questionJS,
      )
      const feedback = joinMobiusData(
        'feedback',
        _feedbackHTML,
        `#${containerId} ` + _feedbackCSS.replace(/}/g, `}#${containerId} `),
        _feedbackJS,
      )

      const scripts = [
        { html: `<div id="${containerId}">${question}</div>`, js: _questionJS, setHTML: setQuestion },
        { html: `<div id="${containerId}">${feedback}</div>`, js: _feedbackJS, setHTML: setFeedback },
      ]
        .map(({ html, js, setHTML }) => {
          const entries = Object.entries(value).map(([key, { value }]) => ['\\$' + key, value])
          for (const [key, value] of entries) html = html.replace(new RegExp(key, 'g'), value)
          setHTML(html)
          return createElement({ tag: 'script', text: js })
        })
        .map((script, i) => ({ element: script, section: i === 0 ? ('question' as const) : ('feedback' as const) }))

      if (isRefObject(iframe)) {
        const parent = iframe.current?.contentWindow?.document.head
        if (parent) {
          parent.innerHTML = ''
          scripts.forEach(({ element, section: _section }) => {
            if (section === _section) parent.appendChild(element)
          })
        }
      }
    },
    store,
  })
}

function changePreviewSection({
  iframe,
  setFeedback,
  setPreviewSection,
  setQuestion,
  store,
  tab,
}: THandler_ChangePreviewSection) {
  const [_algorithm] = store.algorithm
  const [_authornotesHTML] = store.authornotesHTML
  const [_feedbackHTML] = store.feedbackHTML
  const [_questionHTML] = store.questionHTML
  const [_authornotesCSS] = store.authornotesCSS
  const [_feedbackCSS] = store.feedbackCSS
  const [_questionCSS] = store.questionCSS
  const [_authornotesJS] = store.authornotesJS
  const [_feedbackJS] = store.feedbackJS
  const [_questionJS] = store.questionJS
  const [_questionName] = store.questionName

  if (tab === 'Question') {
    previewDocument({ iframe, section: 'question', setFeedback, setQuestion, store })
    setPreviewSection('question')
  }
  if (tab === 'Feedback') {
    previewDocument({ iframe, section: 'feedback', setFeedback, setQuestion, store })
    setPreviewSection('feedback')
  }
  if (tab === 'Default UI') {
    previewLegacyDocument({
      algorithm: _algorithm,
      authornotes: joinMobiusData('authornotes', _authornotesHTML, _authornotesCSS, _authornotesJS),
      feedback: joinMobiusData('feedback', _feedbackHTML, _feedbackCSS, _feedbackJS),
      question: joinMobiusData('question', _questionHTML, _questionCSS, _questionJS),
      questionName: _questionName,
    })
    setPreviewSection('default-ui')
  }
}
