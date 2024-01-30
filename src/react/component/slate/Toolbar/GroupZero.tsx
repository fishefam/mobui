import { isBlockNode, ReactEditor, Transforms } from 'lib/slate'
import { createBlockNode } from 'lib/slate/util'
import { ChevronDown, Heading1, Heading2, Heading3, Heading4, LucideIcon, Pilcrow, Plus, Quote } from 'lucide-react'
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownTrigger } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'
import { isEditor, Node } from 'slate'
import { useSlate } from 'slate-react'
import { TBlockNodeType, TSlateEditor } from 'type/slate'

const SUB_ITEMS: { Icon: LucideIcon; title: string; type: TBlockNodeType }[] = [
  { Icon: Pilcrow, title: 'Paragraph', type: 'paragraph' },
  { Icon: Heading1, title: 'Heading 1', type: 'heading-1' },
  { Icon: Heading2, title: 'Heading 2', type: 'heading-2' },
  { Icon: Heading3, title: 'Heading 3', type: 'heading-3' },
  { Icon: Heading4, title: 'Heading 4', type: 'heading-4' },
  { Icon: Quote, title: 'Quote', type: 'blockquote' },
]

const ITEMS = [
  {
    TriggerIcon: Plus,
    label: 'Basic Block',
    subitems: SUB_ITEMS,
    tooltip: 'Insert',
  },
  {
    TriggerIcon: ({ label }: { label: string }) => <span className="whitespace-nowrap text-xs">{label}</span>,
    label: 'Turn Into',
    subitems: SUB_ITEMS,
    tooltip: 'Turn Into',
  },
]

export default function GroupZero() {
  const editor = useSlate()
  const node = Node.get(editor, editor.selection?.anchor.path.slice(0, -1) ?? [])
  const filteredSubItems =
    !isEditor(node) && isBlockNode(node) ? SUB_ITEMS.filter(({ type }) => node.type === type) : []
  const nodeTypeLabel = filteredSubItems.length ? filteredSubItems[0].title : 'Paragraph'

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
                    onClick={(event) => event.preventDefault()}
                  >
                    <TriggerIcon
                      className="h-3 w-3"
                      label={nodeTypeLabel}
                    />
                    <ChevronDown className="h-3 w-3" />
                  </ToggleGroupItem>
                </div>
              </DropdownTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
          <DropdownContent>
            <DropdownLabel>{label}</DropdownLabel>
            {subitems.map(({ Icon, title, type }) => (
              <DropdownItem
                key={title}
                className="space-x-2"
                onClick={() => handleNode(editor, type, tooltip === 'Insert' ? 'add' : 'change')}
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

function handleNode(editor: TSlateEditor, type: TBlockNodeType, action: 'add' | 'change') {
  if (action === 'add' && editor.selection) {
    editor.insertNodes(createBlockNode(type), { at: [editor.selection.anchor.path[0] + 1] })
    editor.collapse()
    editor.select([editor.selection.anchor.path[0] + 1])
  }
  if (action === 'change') Transforms.changeBlockType(editor, type)
  ReactEditor.focus(editor)
}
