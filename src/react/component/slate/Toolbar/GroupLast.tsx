import { ChevronDown, Pencil } from 'lucide-react'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

export default function GroupLast() {
  return (
    <ToggleGroup
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
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Pencil className="h-3 w-3" />
                    Editing
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </ToggleGroupItem>
              </div>
            </DropdownTrigger>
          </TooltipTrigger>
          <TooltipContent>Editing Mode</TooltipContent>
        </Tooltip>
        <DropdownContent>
          <DropdownItem>Editing</DropdownItem>
          <DropdownItem>Viewing</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </ToggleGroup>
  )
}
