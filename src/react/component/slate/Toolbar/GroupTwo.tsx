import { Tooltip } from '@radix-ui/react-tooltip'
import { isBlockNode } from 'lib/slate'
import { toggleList } from 'lib/slate/plugin/withList'
import { Indent, List, ListOrdered, Outdent } from 'lucide-react'
import { CSSProperties, MouseEvent } from 'react'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'
import { isEditor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
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
                onClick={(event) => handleToggler(event, editor, tooltip)}
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

function handleToggler(
  event: MouseEvent<HTMLButtonElement>,
  editor: TSlateEditor,
  tooltip: (typeof ITEMS)['0' | '1' | '2' | '3']['tooltip'],
): void {
  event.preventDefault()
  const { selection } = editor
  if (selection) {
    if (tooltip === 'Unordered List') toggleList(editor, 'unordered-list')
    if (tooltip === 'Ordered List') toggleList(editor, 'ordered-list')
  }
  ReactEditor.focus(editor)
}

function wrapToList(editor: TSlateEditor, type: 'unordered-list' | 'ordered-list', isTypeChange: boolean) {
  // if (isTypeChange)
  // Transforms.setNodes(editor, { style: toggleListStyle(type), type } as TBlockNode, {
  //   at: editor.selection?.anchor.path.slice(0, -2) ?? [],
  // })
  // if (!isTypeChange) {
  Transforms.setNodes(editor, { type } as TBlockNode)
  // Transforms.wrapNodes(editor, {
  //   attributes: {},
  //   children: [{ text: '' }],
  //   id: generateNodeId(),
  //   style: toggleListStyle(type),
  //   type,
  // } as TBlockNode)
  // }
}

function unwrapList(editor: TSlateEditor) {
  Transforms.setNodes(editor, { type: 'paragraph' } as TBlockNode)
  console.log(Node.parent(editor, editor.selection?.anchor.path ?? []))
  // Transforms.setNodes(editor, { type: 'paragraph' } as TBlockNode)
  // Transforms.unwrapNodes(editor, {
  //   at: editor.selection?.anchor.path.slice(0, -2),
  // })
}
function toggleListStyle(type: TBlockNodeType): CSSProperties {
  return {
    listStyleType: type === 'unordered-list' ? 'disc' : 'decimal',
    marginBottom: '1.5rem',
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
  }
}
