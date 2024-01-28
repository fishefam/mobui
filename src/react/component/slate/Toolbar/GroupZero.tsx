import { ChevronDown, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Pilcrow, Plus } from 'lucide-react'
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownTrigger } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

const SUB_ITEMS = [
  { Icon: Pilcrow, title: 'Paragraph' },
  { Icon: Heading1, title: 'Heading 1' },
  { Icon: Heading2, title: 'Heading 2' },
  { Icon: Heading3, title: 'Heading 3' },
  { Icon: Heading4, title: 'Heading 4' },
  { Icon: Heading5, title: 'Heading 5' },
  { Icon: Heading6, title: 'Heading 6' },
]

const ITEMS = [
  {
    TriggerIcon: Plus,
    label: 'Basic Block',
    subitems: SUB_ITEMS,
    tooltip: 'Insert',
  },
  {
    TriggerIcon: () => <span className="whitespace-nowrap text-xs">Heading 1</span>,
    label: 'Turn Into',
    subitems: SUB_ITEMS,
    tooltip: 'Turn Into',
  },
]

export default function GroupZero() {
  return (
    <ToggleGroup
      size="sm"
      type="single"
    >
      {ITEMS.map(({ TriggerIcon, label, subitems, tooltip }) => (
        <Dropdown key={label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownTrigger
                asChild
                className="flex cursor-default content-between items-center gap-2 focus:outline-none"
              >
                <div>
                  <ToggleGroupItem
                    value="groupzero"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <TriggerIcon className="h-3 w-3" />
                    <ChevronDown className="h-3 w-3" />
                  </ToggleGroupItem>
                </div>
              </DropdownTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
          <DropdownContent>
            <DropdownLabel>{label}</DropdownLabel>
            {subitems.map(({ Icon, title }) => (
              <DropdownItem
                key={title}
                className="space-x-2"
              >
                <span>
                  <Icon className="h-5 w-5" />
                </span>{' '}
                <span>{title}</span>
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      ))}
    </ToggleGroup>
  )
}
