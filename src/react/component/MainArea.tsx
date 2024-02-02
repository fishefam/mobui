import { MathJaxContext } from 'better-react-mathjax'
import Breadcrumb from 'component/Breadcrumb'
import CodeEditor from 'component/CodeEditor'
import { cn } from 'lib/util'
import { Cog } from 'lucide-react'
import { Fragment, useRef } from 'react'
import { useStore } from 'react/Store'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'shadcn/Resizable'

import AlgoPreview from './AlgoPreview'
import TextEditor from './TextEditor'

export default function MainArea() {
  const { panelLayout } = useStore()
  const [_panelLayout] = panelLayout

  return (
    <div className="h-full">
      <Breadcrumb />
      <div
        className="pb-1 pt-3"
        style={{ height: 'calc(100% - 2rem)' }}
      >
        <ResizablePanelGroup
          className="h-full rounded border"
          direction={_panelLayout === 'top' ? 'vertical' : 'horizontal'}
        >
          {_panelLayout === 'right' ? (
            <>
              <TextEditorContainer />
              <Handle />
              <CodeEditorContainer />
            </>
          ) : (
            <>
              <CodeEditorContainer />
              <Handle />
              <TextEditorContainer />
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function CodeEditorContainer() {
  const { panelLayout } = useStore()
  const [_panelLayout] = panelLayout

  return (
    <ResizablePanel defaultSize={30}>
      <ResizablePanelGroup direction={_panelLayout === 'top' ? 'horizontal' : 'vertical'}>
        <AlgorithmEditor />
        <NonAlgorithmEditor />
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}

function AlgorithmEditor() {
  const store = useStore()
  const [currentSection] = store.section

  if (currentSection !== 'algorithm') return null

  return (
    <ResizablePanel>
      <div className="relative h-full">
        <CodeEditor language="ALGORITHM" />
      </div>
    </ResizablePanel>
  )
}

function NonAlgorithmEditor() {
  const { section } = useStore()
  const [currentSection] = section

  if (currentSection === 'algorithm') return null
  return (['HTML', 'CSS', 'JS'] as const).map((language, i, arr) => (
    <Fragment key={language}>
      <ResizablePanel>
        <CodeEditor language={language} />
      </ResizablePanel>
      {i < arr.length - 1 ? <Handle /> : null}
    </Fragment>
  ))
}

function TextEditorContainer() {
  const { section } = useStore()
  const [currentSection] = section
  const ref = useRef<HTMLDivElement>(null)

  return (
    <MathJaxContext>
      <ResizablePanel className="!overflow-auto">
        <div
          ref={ref}
          className="relative h-full min-w-[37rem]"
        >
          <div className={cn('absolute left-0 top-0 hidden h-full w-full', currentSection === 'algorithm' && '!block')}>
            <AlgoPreview parent={ref} />
            <Cog
              className="absolute bottom-3 right-3 hidden h-5 w-5 animate-spin"
              id={'cog-spinner-algo-preview'}
            />
          </div>
          <div className={cn('absolute left-0 top-0 hidden h-full w-full', currentSection !== 'algorithm' && '!block')}>
            <TextEditor />
          </div>
        </div>
      </ResizablePanel>
    </MathJaxContext>
  )
}

function Handle() {
  return <ResizableHandle withHandle />
}
