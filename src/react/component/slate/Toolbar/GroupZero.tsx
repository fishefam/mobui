import { ReactEditor } from 'lib/slate'
import { generateNodeId } from 'lib/slate/util'
import { ChevronDown, Heading1, Heading2, Heading3, Heading4, LucideIcon, Pilcrow, Plus, Quote } from 'lucide-react'
import { useState } from 'react'
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownTrigger } from 'shadcn/Dropdown'
import { ToggleGroup, ToggleGroupItem } from 'shadcn/ToggleGroup'
import { Tooltip, TooltipContent, TooltipTrigger } from 'shadcn/Tooltip'
import { Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { TSetState } from 'type/common'
import { TBlockNode, TBlockNodeType, TSlateEditor } from 'type/slate'

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
  const [currentNodeType, setCurrentNodeType] = useState<TBlockNodeType>('paragraph')
  const nodeTypeLabel = SUB_ITEMS.filter(({ type }) => type === currentNodeType)[0].title

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
                onClick={() => handleNode(editor, type, setCurrentNodeType, tooltip === 'Insert' ? 'add' : 'change')}
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

function handleNode(
  editor: TSlateEditor,
  type: TBlockNodeType,
  setCurrentNodeType: TSetState<TBlockNodeType>,
  action: 'add' | 'change',
) {
  if (action === 'add') {
    const node: TBlockNode = { attributes: {}, children: [{ text: '' }], id: generateNodeId(), style: {}, type }
    Transforms.insertNodes(editor, node)
  }
  if (action === 'change') Transforms.setNodes(editor, { type })
  setCurrentNodeType(type)
  ReactEditor.focus(editor)
}
