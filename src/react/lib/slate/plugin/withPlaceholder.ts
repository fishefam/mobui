import { BaseOperation, BaseSelection, Node } from 'slate'
import { TSlateEditor } from 'type/slate'

export default function withPlaceholder(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    const preapplyPath = handlePreApply(editor, operation)
    apply(operation)
    handlePostApply(editor, operation, preapplyPath)
  }
  return editor
}

function handlePreApply(editor: TSlateEditor, operation: BaseOperation) {
  if (operation.type === 'split_node') editor.setNodes({ placeholder: 'Start typing...' })
  return editor.selection
}

function handlePostApply(editor: TSlateEditor, operation: BaseOperation, preapplyPath: BaseSelection) {
  if (editor.selection && preapplyPath) {
    handleSplitSelect(editor, operation, preapplyPath)
    handleInsertRemoveText(editor, operation)
  }
}

function handleSplitSelect(editor: TSlateEditor, operation: BaseOperation, preapplyPath: BaseSelection) {
  if (['set_selection', 'split_node'].includes(operation.type)) setClassNames(editor, false, preapplyPath)
}

function handleInsertRemoveText(editor: TSlateEditor, operation: BaseOperation) {
  if (['insert_text', 'remove_text'].includes(operation.type)) setClassNames(editor, true)
}

function setClassNames(editor: TSlateEditor, unsetCondition: boolean, preapplyPath?: BaseSelection) {
  const text = getText(editor)
  const predicate = unsetCondition ? text.length > 0 : true
  if (!text.length) editor.setNodes({ className: getClassNames() })
  try {
    if (predicate) editor.setNodes({ className: undefined }, preapplyPath ? { at: preapplyPath } : {})
  } catch {
    /* empty */
  }
}

function getText(editor: TSlateEditor) {
  return Node.string(editor.node(editor.selection!)[0])
}

function getClassNames() {
  return 'before:absolute before:cursor-text before:opacity-30 before:content-[attr(aria-placeholder)]'
}
