import { CSSProperties } from 'react'
import { BaseOperation } from 'slate'
import { TObject } from 'type/common'
import { TNodeType, TSlateEditor } from 'type/slate'

export default function withList(editor: TSlateEditor) {
  const { apply } = editor
  editor.apply = (operation) => {
    setList(editor, operation)
    apply(operation)
  }
  return editor
}

function setList(editor: TSlateEditor, operation: BaseOperation) {
  if (operation.type === 'set_node' && editor.selection) {
    // const _wrapperNode = Node.get(editor, editor.selection.anchor.path.slice(0, -2)) as TBlockNode
    // const __wrapperNode = Node.get(editor, editor.selection.anchor.path.slice(0, -1)) as TBlockNode
    // const wrapperNode = isEditor(_wrapperNode) ? __wrapperNode : _wrapperNode
    // const allowChange = isBlockNode(wrapperNode) && hasListTypeProp(operation.newProperties)
    // const shouldSetNode = allowChange && !['ordered-list', 'unordered-list'].includes(wrapperNode.type)
    // const shouldUnsetNode = allowChange && ['ordered-list', 'unordered-list'].includes(wrapperNode.type)
    // if (shouldSetNode) {
    //   const { listType } = operation.newProperties as {
    //     listType: 'ordered-list' | 'unordered-list'
    //     type: TNodeType
    //   }
    //   Transforms.setNodes(editor, { type: 'list-item' } as TBlockNode)
    //   Transforms.wrapNodes(editor, {
    //     attributes: {},
    //     children: [{ text: '' }],
    //     id: generateNodeId(),
    //     style: getListStyle(listType),
    //     type: listType,
    //   } as TBlockNode)
    // }
    // if (shouldUnsetNode) {
    //   Transforms.collapse(editor)
    //   Transforms.setNodes(editor, { type: 'paragraph' } as TBlockNode)
    //   Transforms.unwrapNodes(editor, { at: editor.selection.anchor.path.slice(0, -2) })
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

function hasListTypeProp(property: TObject): property is { listType: 'ordered-list' | 'unordered-list' } {
  return !!property.listType
}
