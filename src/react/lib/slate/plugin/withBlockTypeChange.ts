import { BaseOperation } from 'slate'
import { TSlateEditor } from 'type/slate'

import { isSetNodeOperation } from '..'

/**
 * Enhances a Slate.js editor to handle block type changes.
 * @param editor - The Slate.js editor to enhance.
 * @returns The enhanced editor.
 */
export default function withBlockTypeChange(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    changeBlockType(editor, operation)
    apply(operation)
  }
  return editor
}

/**
 * Handles block type changes based on the applied operation.
 * @param editor - The Slate.js editor.
 * @param operation - The applied operation.
 */
function changeBlockType(editor: TSlateEditor, operation: BaseOperation) {
  if (editor.selection && isSetNodeOperation(['nextType'], operation)) {
    editor.setNodes({ type: operation.newProperties.nextType })
  }
}
