import { ChevronDown, Image, Link2, Smile, Table } from 'lucide-react'
import { BREAK_POINT } from 'react/constant'
import { useWindowSize } from 'react/hook'
import { Dropdown, DropdownContent } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

const ITEMS = [
  { Icon: Link2, tooltip: 'Link' },
  { Icon: Image, tooltip: 'Image' },
  { Icon: Table, isDropdown: true, tooltip: 'Table' },
  { Icon: Smile, isDropdown: true, tooltip: 'Emoji' },
]

export default function GroupThree() {
  const { width } = useWindowSize()

  return (
    <ToggleGroup type="multiple">
      {ITEMS.slice(0, width <= BREAK_POINT.md ? -2 : undefined).map((item) =>
        item.isDropdown ? (
          <Dropdown key={item.tooltip}>
            <Item {...item} />
            <DropdownContent></DropdownContent>
          </Dropdown>
        ) : (
          <Item
            key={item.tooltip}
            {...item}
          />
        ),
      )}
    </ToggleGroup>
  )
}

function Item({ Icon, isDropdown, tooltip }: (typeof ITEMS)[0]) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <ToggleGroupItem
            className="cursor-default"
            value="groupthree"
            onClick={(e) => e.preventDefault()}
          >
            <Icon className="h-3 w-3" />
            {isDropdown ? <ChevronDown className="h-3 w-3" /> : null}
          </ToggleGroupItem>
        </div>
      </TooltipTrigger>
      <TooltipContent side={isDropdown ? 'top' : 'bottom'}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
