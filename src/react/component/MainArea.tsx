import { useElementHeight } from 'hook/util'
import { Fragment, useRef } from 'react'
import Breadcrumb from 'shadcn/Breadcrumb'
import CodeEditor from 'shadcn/CodeEditor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'shadcn/Resizable'

export default function MainArea() {
  const breadcrumbRef = useRef<HTMLOListElement>(null)
  const breadcrumbHeight = useElementHeight(breadcrumbRef)

  return (
    <div className="h-full">
      <Breadcrumb ref={breadcrumbRef} />
      <div
        className="pb-1 pt-3"
        style={{ height: `calc(100% - ${breadcrumbHeight}px)` }}
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
    <ResizablePanel defaultSize={25}>
      <ResizablePanelGroup direction="vertical">
        {(['HTML', 'CSS', 'JS'] as const).map((language, i, arr) => (
          <Fragment key={language}>
            <ResizablePanel>
              <CodeEditor language={language} />
            </ResizablePanel>
            {i < arr.length - 1 ? <Handle /> : null}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}

function TextEditorContainer() {
  return (
    <ResizablePanel defaultSize={75}>
      <div className="flex h-full items-center justify-center p-6">
        <span className="font-semibold">SlateJS</span>
      </div>
    </ResizablePanel>
  )
}

function Handle() {
  return <ResizableHandle withHandle />
}
