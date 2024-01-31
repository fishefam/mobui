import CodeEditor from 'component/CodeEditor'
import { fetchAlgoValue } from 'lib/mobius'
import { cn } from 'lib/util'
import { Fragment, useRef } from 'react'
import { useStore } from 'react/Store'
import Breadcrumb from 'shadcn/Breadcrumb'
import { Button } from 'shadcn/Button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'shadcn/Resizable'

import AlgoPreview from './AlgoPreview'
import TextEditor from './TextEditor'

export default function MainArea() {
  return (
    <div className="h-full">
      <Breadcrumb />
      <div
        className="pb-1 pt-3"
        style={{ height: 'calc(100% - 2rem)' }}
      >
        <ResizablePanelGroup
          className="h-full rounded border"
          direction="horizontal"
        >
          <CodeEditorContainer />
          <Handle />
          <TextEditorContainer />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function CodeEditorContainer() {
  return (
    <ResizablePanel defaultSize={35}>
      <ResizablePanelGroup direction="vertical">
        <AlgorithmEditor />
        <NonAlgorithmEditor />
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}

function AlgorithmEditor() {
  const store = useStore()
  const [currentSection] = store.section
  const [_, setAlgorithmPreview] = store.algorithmPreview

  if (currentSection !== 'algorithm') return null

  return (
    <ResizablePanel>
      <div className="relative h-full">
        <CodeEditor language="ALGORITHM" />
        <Button
          className="absolute bottom-4 right-4"
          variant="secondary"
          // onClick={() => fetchAlgoValue(store, (value) => setAlgorithmPreview(value))}
          onClick={() => fetchAlgoValue({ onSuccess: (value) => setAlgorithmPreview(value), store })}
        >
          Preview
        </Button>
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
    <ResizablePanel>
      <div
        ref={ref}
        className="relative h-full min-w-[37rem]"
      >
        <div className={cn('absolute left-0 top-0 hidden h-full w-full', currentSection === 'algorithm' && '!block')}>
          <AlgoPreview parent={ref} />
        </div>
        <div className={cn('absolute left-0 top-0 hidden h-full w-full', currentSection !== 'algorithm' && '!block')}>
          <TextEditor />
        </div>
      </div>
    </ResizablePanel>
  )
}

function Handle() {
  return <ResizableHandle withHandle />
}
