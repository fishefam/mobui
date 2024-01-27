import { RefObject, useEffect, useRef, useState } from 'react'
import Breadcrumb from 'shadcn/Breadcrumb'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'shadcn/resizable'

export default function MainArea() {
  const breadcrumbRef = useRef<HTMLOListElement>(null)
  const breadcrumbHeight = useBreadcrumbHeight(breadcrumbRef)

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
          <ResizableHandle withHandle />
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
        <ResizablePanel>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">HTML</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">CSS</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Javacript</span>
          </div>
        </ResizablePanel>
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

function useBreadcrumbHeight(ref: RefObject<HTMLOListElement>) {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (ref.current) setHeight(ref.current.clientHeight)
  }, [ref])
  return height
}
