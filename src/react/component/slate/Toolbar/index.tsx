import { Menubar } from 'shadcn/MenuBar'
import { Separator } from 'shadcn/Separator'
import { TooltipProvider } from 'shadcn/Tooltip'

import GroupLast from './GroupLast'
import GroupOne from './GroupOne'
import GroupThree from './GroupThree'
import GroupTwo from './GroupTwo'
import GroupZero from './GroupZero'

export default function SlateToolbar() {
  return (
    <TooltipProvider>
      <Menubar className="relative h-auto rounded-none border-x-0 border-b border-t-0 px-2">
        <div className="flex flex-wrap">
          <GroupZero />
          <Separator
            className="mx-1 h-10"
            orientation="vertical"
          />
          <GroupOne />
          <Separator
            className="mx-1 h-10"
            orientation="vertical"
          />
          <GroupTwo />
          <Separator
            className="mx-1 h-10"
            orientation="vertical"
          />
          <GroupThree />
        </div>
        <div className="absolute right-0 top-1 flex h-10 content-center items-center bg-white pr-4 dark:bg-black">
          <GroupLast />
        </div>
      </Menubar>
    </TooltipProvider>
  )
}