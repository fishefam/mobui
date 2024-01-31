import { RefObject } from 'react'
import { useStore } from 'react/Store'
import { Menubar } from 'shadcn/Menubar'

import EditMenu from './Edit'
import FileMenu from './File'
import InsertMenu from './Insert'
import ViewMenu from './View'

type TSlateMenuProps = { [key in 'containerRef' | 'editorRef']: RefObject<HTMLElement> }

export default function SlateMenu({ containerRef, editorRef }: TSlateMenuProps) {
  const { isUnsaved } = useStore()
  const [_isUnsaved] = isUnsaved

  return (
    <Menubar className="w-full justify-between rounded-none border-0 !border-b">
      <div className="flex">
        <FileMenu editorRef={editorRef} />
        <EditMenu />
        <ViewMenu containerRef={containerRef} />
        <InsertMenu />
      </div>
      {_isUnsaved ? <div className="!mr-5 text-xs">Unsaved Changes</div> : null}
    </Menubar>
  )
}
