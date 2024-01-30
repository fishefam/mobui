import { Tooltip } from '@radix-ui/react-tooltip'
import { isBlockNode, Transforms } from 'lib/slate'
import { Indent, List, ListOrdered, Outdent } from 'lucide-react'
import { MouseEvent } from 'react'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'
import { isEditor, Node } from 'slate'
import { useSlate } from 'slate-react'
import { TBlockNode, TBlockNodeType, TSlateEditor } from 'type/slate'

const ITEMS = [
  { Icon: List, tooltip: 'Unordered List', type: 'unordered-list' as TBlockNodeType },
  { Icon: ListOrdered, tooltip: 'Ordered List', type: 'ordered-list' as TBlockNodeType },
  { Icon: Outdent, tooltip: 'Outdent', type: 'non-type' },
  { Icon: Indent, tooltip: 'Indent', type: 'non-type' },
] as const

export default function GroupTwo() {
  const editor = useSlate()
  const node = Node.get(editor, editor.selection?.anchor.path.slice(0, -2) ?? []) as TBlockNode | TSlateEditor
  const type = !isEditor(node) && isBlockNode(node) ? node.type : ''

  return (
    <ToggleGroup type="multiple">
      {ITEMS.map(({ Icon, tooltip, type: _type }) => (
        <Tooltip key={tooltip}>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="cursor-default"
                data-state={type === _type ? 'on' : 'off'}
                value="grouptwo"
                onClick={(event) => _type !== 'non-type' && handleToggler(event, editor, _type)}
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

function handleToggler(event: MouseEvent<HTMLButtonElement>, editor: TSlateEditor, type: TBlockNodeType): void {
  event.preventDefault()
  const { selection } = editor
  if (selection) Transforms.changeBlockType(editor, type)
}
