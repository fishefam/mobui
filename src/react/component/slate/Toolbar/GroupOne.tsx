import { Bold, Code, Italic, PaintBucket, Strikethrough, Underline } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'

const ITEMS = [
  { Icon: Bold, tooltip: 'Bold' },
  { Icon: Italic, tooltip: 'Italic' },
  { Icon: Underline, tooltip: 'Underline' },
  { Icon: Strikethrough, tooltip: 'Strikethrough' },
  { Icon: Code, tooltip: 'Code' },
  { Icon: PaintBucket, tooltip: 'Paintbucket' },
]

export default function GroupOne() {
  return (
    <ToggleGroup
      size="sm"
      type="multiple"
    >
      {ITEMS.map(({ Icon, tooltip }) => (
        <Tooltip key={tooltip}>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="cursor-default"
                value="groupone"
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
