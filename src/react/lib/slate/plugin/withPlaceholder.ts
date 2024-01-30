import {
  BaseOperation,
  BaseSelection,
  InsertTextOperation,
  Node,
  RemoveTextOperation,
  SetSelectionOperation,
  SplitNodeOperation,
} from 'slate'
import { TSlateEditor } from 'type/slate'

// Importing the isOperationMatched utility function from the parent directory
import { isOperationMatched } from '..'

/**
 * Adds placeholder feature on empty lines.
 * @param editor - The editor to enhance.
 * @returns The enhanced editor.
 */
export default function withPlaceholder(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    const preApplyPath = editor.selection
    apply(operation)
    handlePostApply(editor, operation, preApplyPath)
  }
  return editor
}

/**
 * Handles post-apply adjustments in the editor.
 * @param editor - The editor.
 * @param operation - The applied operation.
 * @param preApplyPath - The selection path before applying the operation.
 */
function handlePostApply(editor: TSlateEditor, operation: BaseOperation, preApplyPath: BaseSelection) {
  if (editor.selection && preApplyPath) {
    handleSplitAndSelect(editor, operation, preApplyPath)
    handleInsertAndRemoveText(editor, operation)
  }
}

/**
 * Handles split and select operations by setting specific class names.
 * @param editor - The editor.
 * @param operation - The applied operation.
 * @param preApplyPath - The selection path before applying the operation.
 */
function handleSplitAndSelect(editor: TSlateEditor, operation: BaseOperation, preApplyPath: BaseSelection) {
  if (isOperationMatched<SetSelectionOperation | SplitNodeOperation>(operation, 'set_selection', 'split_node'))
    setClassNames(editor, false, preApplyPath)
}

/**
 * Handles insert and remove text operations by setting specific class names.
 * @param editor - The editor.
 * @param operation - The applied operation.
 */
function handleInsertAndRemoveText(editor: TSlateEditor, operation: BaseOperation) {
  if (isOperationMatched<InsertTextOperation | RemoveTextOperation>(operation, 'insert_text', 'remove_text'))
    setClassNames(editor, true)
}

/**
 * Sets specific class names in the editor based on conditions.
 * @param editor - The editor.
 * @param unsetCondition - Whether to unset the class names.
 * @param preApplyPath - The selection path before applying the operation (optional).
 */
function setClassNames(editor: TSlateEditor, unsetCondition: boolean, preApplyPath?: BaseSelection) {
  const text = getText(editor)
  const predicate = unsetCondition ? text.length > 0 : true
  if (!text.length) editor.setNodes({ className: getClassNames() })
  try {
    if (predicate) editor.setNodes({ className: undefined }, preApplyPath ? { at: preApplyPath } : {})
  } catch {
    /* Unexpected split_node behavior is causing an error in setNodes */
    /* Temporary fix */
  }
}

/**
 * Gets the text content from the current selection in the editor.
 * @param editor - The editor.
 * @returns The text content.
 */
function getText(editor: TSlateEditor) {
  return Node.string(editor.node(editor.selection!)[0])
}

/**
 * Returns a string containing CSS class names related to a placeholder.
 * @returns The CSS class names.
 */
function getClassNames() {
  return 'before:absolute before:cursor-text before:opacity-30 before:content-[attr(aria-placeholder)]'
}
