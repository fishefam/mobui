import ColorPicker from 'component/ColorPicker'
import { useWindowSize } from 'react/hook'
import { ReactEditor } from 'lib/slate'
import { cn } from 'lib/util'
import { Baseline, Bold, Code, Italic, LucideIcon, PaintBucket, Strikethrough, Underline } from 'lucide-react'
import { MouseEvent } from 'react'
import { BREAK_POINT } from 'react/constant'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'
import { useSlate } from 'slate-react'
import { TMark, TSlateEditor, TTrueMark, TValueMark } from 'type/slate'

const ITEMS: { Icon: LucideIcon; tooltip: string; trueMark?: TTrueMark; valueMark?: TValueMark }[] = [
  { Icon: Bold, tooltip: 'Bold', trueMark: 'bold' },
  { Icon: Italic, tooltip: 'Italic', trueMark: 'italic' },
  { Icon: Underline, tooltip: 'Underline', trueMark: 'underline' },
  { Icon: Strikethrough, tooltip: 'Strikethrough', trueMark: 'strikethrough' },
  { Icon: Code, tooltip: 'Code', trueMark: 'code' },
  { Icon: Baseline, tooltip: 'Text Color', valueMark: 'color' },
  { Icon: PaintBucket, tooltip: 'Highlight', valueMark: 'backgroundColor' },
]

export default function GroupOne() {
  const { width } = useWindowSize()

  return (
    <ToggleGroup
      size="sm"
      type="multiple"
    >
      {ITEMS.slice(0, width <= BREAK_POINT.md ? -2 : undefined).map(({ Icon, tooltip, trueMark, valueMark }) => (
        <Tooltip key={tooltip}>
          {trueMark ? (
            <TooltipTrigger asChild>
              <div>
                <ToggleItem
                  Icon={Icon}
                  mark={trueMark}
                />
              </div>
            </TooltipTrigger>
          ) : valueMark ? (
            <ColorPicker mark={valueMark}>
              <TooltipTrigger asChild>
                <div>
                  <ToggleItem
                    Icon={Icon}
                    mark={trueMark}
                  />
                </div>
              </TooltipTrigger>
            </ColorPicker>
          ) : null}
          <TooltipContent side={trueMark && 'bottom'}>{tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  )
}

function ToggleItem({ Icon, mark }: { Icon: LucideIcon; mark?: TMark }) {
  const editor = useSlate()
  return (
    <ToggleGroupItem
      className={cn('cursor-default')}
      data-state={Object.keys(editor.getMarks() ?? {}).includes(mark ?? '') ? 'on' : 'off'}
      value="groupone"
      onClick={(event) => toggleMark(event, editor, mark)}
    >
      <Icon className="h-3 w-3" />
    </ToggleGroupItem>
  )
}

function toggleMark(event: MouseEvent<HTMLButtonElement>, editor: TSlateEditor, mark?: TMark) {
  event.preventDefault()
  if (mark) {
    const currentMark = editor.getMarks()
    const currentMarkKeys = Object.keys(currentMark ?? {})
    if (!currentMarkKeys.includes(mark)) editor.addMark(mark, true)
    if (currentMarkKeys.includes(mark)) editor.removeMark(mark)
    ReactEditor.focus(editor)
  }
}
