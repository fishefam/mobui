import { Fragment } from 'react'
import Breadcrumb from 'shadcn/Breadcrumb'
import CodeEditor from 'shadcn/CodeEditor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'shadcn/Resizable'

import TextEditor from './TextEditor'

export default function MainArea() {
  console.log('render MainArea')
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
      <TextEditor />
    </ResizablePanel>
  )
}

function Handle() {
  return <ResizableHandle withHandle />
}
