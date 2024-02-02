import { useWindowsSize } from 'hook/util'
import { cn } from 'lib/util'
import { ChevronDown } from 'lucide-react'
import { RefObject } from 'react'
import { BREAK_POINT } from 'react/constant'
import { useStore } from 'react/Store'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from 'shadcn/Dropdown'
import { Menubar } from 'shadcn/Menubar'
import { TNormalizedSection } from 'type/data'

import EditMenu from './Edit'
import FileMenu from './File'
import InsertMenu from './Insert'
import ViewMenu from './View'

type TSlateMenuProps = { [key in 'containerRef']: RefObject<HTMLElement> }

export default function SlateMenu({ containerRef }: TSlateMenuProps) {
  const { isUnsaved, section } = useStore()
  const { width } = useWindowsSize()

  const [currentSection, setCurrentSection] = section
  const label =
    currentSection === 'authornotes' ? 'Author Notes' : currentSection === 'feedback' ? 'Feedback' : 'Question'

  const [_isUnsaved] = isUnsaved

  return (
    <Menubar className="w-full justify-between gap-1 rounded-none border-0 !border-b">
      <div className="flex">
        {width <= BREAK_POINT.md ? (
          <Dropdown>
            <DropdownTrigger className="group mx-2 flex items-center text-xs font-bold focus:outline-none">
              {label.toUpperCase()}
              <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
            </DropdownTrigger>
            <DropdownContent>
              {(['question', 'authornotes', 'algorithm', 'feedback'] as TNormalizedSection[]).map((_section) => (
                <DropdownItem
                  key={_section}
                  className={cn('my-1', _section === currentSection ? 'bg-accent' : '')}
                  onClick={() => setCurrentSection(_section)}
                >
                  {_section === 'authornotes'
                    ? 'Author Notes'
                    : _section === 'feedback'
                      ? 'Feedback'
                      : _section === 'algorithm'
                        ? 'Algorithm'
                        : 'Question'}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        ) : null}
        <FileMenu />
        <EditMenu />
        <ViewMenu containerRef={containerRef} />
        <InsertMenu />
      </div>
      {_isUnsaved ? <div className="!mr-5 hidden text-xs md:block">Unsaved Changes</div> : null}
    </Menubar>
  )
}
