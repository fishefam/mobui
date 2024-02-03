import { Menubar } from 'shadcn/Menubar'
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
      <Menubar className="relative flex h-auto grid-cols-[auto_6rem] overflow-auto rounded-none border-x-0 border-b border-t-0 px-2 md:grid">
        <div className="flex md:flex-wrap">
          <GroupZero />
          <Separator
            className="mx-1 hidden h-10 md:block"
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
        <div className="top-1 flex h-10 content-center items-center self-baseline bg-white pr-4 dark:bg-[#030711]">
          <GroupLast />
        </div>
      </Menubar>
    </TooltipProvider>
  )
}
