import { hasString } from 'lib/util'
import { CSSProperties } from 'react'
import { BaseOperation } from 'slate'
import { TBlockNodeType, TNodeType, TSlateEditor } from 'type/slate'

import { isSetNodeOperation } from '..'
import { createBlockNode } from '../util'

export default function withList(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    setList(editor, operation)
    apply(operation)
  }
  return editor
}

function setList(editor: TSlateEditor, operation: BaseOperation) {
  if (
    isSetNodeOperation(['nextType', 'wrapperListType'], operation) &&
    hasString<TBlockNodeType>(['list-item'], operation.newProperties.nextType) &&
    hasString<TBlockNodeType>(['ordered-list', 'unordered-list'], operation.newProperties.wrapperListType) &&
    editor.selection
  ) {
    console.log(operation)
    editor.wrapNodes(
      createBlockNode({
        style: getListStyle(operation.newProperties.nextType),
        type: operation.newProperties.wrapperListType,
      }),
    )

    // editor.wrapNodes(createBlockNode('ordered-list'))
    // const _wrapperNode = Node.get(editor, editor.selection.anchor.path.slice(0, -2)) as TBlockNode
    // const __wrapperNode = Node.get(editor, editor.selection.anchor.path.slice(0, -1)) as TBlockNode
    // const wrapperNode = isEditor(_wrapperNode) ? __wrapperNode : _wrapperNode
    // const allowChange =
    //   isBlockNode(wrapperNode) &&
    //   hasProps<'nextType', TPluginNodeProps['nextType']>(operation.newProperties, 'nextType')
    // const shouldSetNode = allowChange && !['ordered-list', 'unordered-list'].includes(wrapperNode.nextType ?? '')
    // const shouldUnsetNode = allowChange && ['ordered-list', 'unordered-list'].includes(wrapperNode.nextType ?? '')
    // if (shouldSetNode) {
    //   const { nextType } = operation.newProperties
    // editor.setNodes({ type: 'list-item' })
    /* editor.wrapNodes({
        attributes: {},
        children: [{ text: '' }],
        id: generateNodeId(),
        placeholder: 'Start typing...',
        previousType: 'blockquote',
        style: getListStyle(nextType),
        type: nextType,
      } as TBlockNode) */
    // }
    // if (shouldUnsetNode) {
    //   editor.collapse()
    //   editor.setNodes({ type: 'paragraph' })
    //   editor.unwrapNodes({ at: editor.selection.anchor.path.slice(0, -2) })
    // }
  }
}

function getListStyle(type: TNodeType): CSSProperties {
  return {
    listStyleType: type === 'unordered-list' ? 'disc' : 'decimal',
    marginBottom: '1.5rem',
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
  }
}
