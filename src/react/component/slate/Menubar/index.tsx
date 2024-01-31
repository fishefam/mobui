import { RefObject } from 'react'
import { Menubar } from 'shadcn/Menubar'

import EditMenu from './Edit'
import FileMenu from './File'
import InsertMenu from './Insert'
import ViewMenu from './View'

type TSlateMenuProps = { containerRef: RefObject<HTMLElement> }

export default function SlateMenu({ containerRef }: TSlateMenuProps) {
  return (
    <Menubar className="rounded-none border-0 !border-b">
      <FileMenu />
      <EditMenu />
      <ViewMenu containerRef={containerRef} />
      <InsertMenu />
    </Menubar>
  )
}
