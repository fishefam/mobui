import { RefObject } from 'react'
import { useStore } from 'react/Store'
import { Menubar } from 'shadcn/Menubar'

import EditMenu from './Edit'
import FileMenu from './File'
import InsertMenu from './Insert'
import ViewMenu from './View'

type TSlateMenuProps = { [key in 'containerRef']: RefObject<HTMLElement> }

export default function SlateMenu({ containerRef }: TSlateMenuProps) {
  const { isUnsaved } = useStore()
  const [_isUnsaved] = isUnsaved

  return (
    <Menubar className="w-full justify-between gap-1 rounded-none border-0 !border-b">
      <div className="flex">
        <FileMenu />
        <EditMenu />
        <ViewMenu containerRef={containerRef} />
        <InsertMenu />
      </div>
      {_isUnsaved ? <div className="!mr-5 text-xs">Unsaved Changes</div> : null}
    </Menubar>
  )
}
