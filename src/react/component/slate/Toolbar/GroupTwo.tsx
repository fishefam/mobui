import { Tooltip } from '@radix-ui/react-tooltip'
import { Indent, List, ListOrdered, Outdent } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

const ITEMS = [
  { Icon: List, tooltip: 'Unordered List' },
  { Icon: ListOrdered, tooltip: 'Ordered List' },
  { Icon: Outdent, tooltip: 'Outdent' },
  { Icon: Indent, tooltip: 'Indent' },
]

export default function GroupTwo() {
  return (
    <ToggleGroup type="multiple">
      {ITEMS.map(({ Icon, tooltip }) => (
        <Tooltip key={tooltip}>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="cursor-default"
                value="grouptwo"
                onClick={(e) => e.preventDefault()}
              >
                <Icon className="h-3 w-3" />
              </ToggleGroupItem>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">{tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  )
}
