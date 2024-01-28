import CodeEditor, { getCodeStore } from 'component/CodeEditor'
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

  async function previewAlgo() {
    const response = await fetch(`${location.origin}/rest/algorithms?${document.cookie}`, {
      body: getCodeStore(store, 'ALGORITHM')[0],
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    setAlgorithmPreview(await response.json())
  }

  if (currentSection !== 'algorithm') return null

  return (
    <ResizablePanel>
      <div className="relative h-full">
        <CodeEditor language="ALGORITHM" />
        <Button
          className="absolute bottom-4 right-4"
          variant="secondary"
          onClick={previewAlgo}
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
        className="h-full min-w-[37rem]"
      >
        {currentSection === 'algorithm' ? <AlgoPreview parent={ref} /> : <TextEditor />}
      </div>
    </ResizablePanel>
  )
}

function Handle() {
  return <ResizableHandle withHandle />
}
