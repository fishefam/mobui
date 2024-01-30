import { BaseOperation } from 'slate'
import { TObject } from 'type/common'
import { TBlockNodeType, TSlateEditor } from 'type/slate'

export default function withBlockTypeChange(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    changeBlockType(editor, operation)
    apply(operation)
  }
  return editor
}

function changeBlockType(editor: TSlateEditor, operation: BaseOperation) {
  if (operation.type === 'set_node' && editor.selection && hasNextType(operation.newProperties))
    editor.setNodes({ type: operation.newProperties.nextType })
}

function hasNextType(property: TObject): property is { nextType: TBlockNodeType } {
  return !!property.nextType
}
