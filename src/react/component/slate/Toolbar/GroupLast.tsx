import { Check, ChevronDown, Eye, Pencil } from 'lucide-react'
import { useStore } from 'react/Store'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

export default function GroupLast() {
  const store = useStore()
  const [currentSection] = store.section
  const editingMode =
    currentSection === 'algorithm' ? 'Editing' : store[`${currentSection}SlateReadOnly`][0] ? 'Viewing' : 'Editing'
  const setReadOnly = currentSection === 'algorithm' ? () => {} : store[`${currentSection}SlateReadOnly`][1]

  return (
    <ToggleGroup
      className="hidden md:block"
      size="sm"
      type="single"
    >
      <Dropdown>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownTrigger
              asChild
              className="flex items-center gap-1 text-sm"
            >
              <div>
                <ToggleGroupItem
                  value="grouplast"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="inline-flex items-center gap-1 text-xs">
                    {editingMode === 'Editing' ? <Pencil className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {editingMode}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </ToggleGroupItem>
              </div>
            </DropdownTrigger>
          </TooltipTrigger>
          <TooltipContent>Editing Mode</TooltipContent>
        </Tooltip>
        <DropdownContent>
          <DropdownItem onClick={() => setReadOnly(false)}>
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs">
                <Pencil className="h-3 w-3" /> Editing
              </span>
              {editingMode === 'Editing' ? <Check className="h-3 w-3" /> : null}
            </div>
          </DropdownItem>
          <DropdownItem onClick={() => setReadOnly(true)}>
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs">
                <Eye className="h-3 w-3" /> Viewing
              </span>
              {editingMode === 'Viewing' ? <Check className="h-3 w-3" /> : null}
            </div>
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </ToggleGroup>
  )
}
