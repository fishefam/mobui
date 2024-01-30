import { isEditor, Node, Transforms } from 'slate'
import { TBlockNode, TMark, TNode, TSlateEditor } from 'type/slate'

import { isLeafNode } from '..'
import { LIFTED_MARKS } from '../register'

export default function withMark(editor: TSlateEditor) {
  const { addMark } = editor
  editor.addMark = (mark, value) => {
    if (!LIFTED_MARKS.includes(mark as TMark)) {
      addMark(mark, value)
      return
    }

    const [node] = editor.nodes({
      match: (node) => !isEditor(node) && isLeafNode(node),
    })
    if (node) {
      const [, path] = node
      const parent = Node.parent(editor, path) as TNode
      const parentPath = path.slice(0, -1)
      if (!isLeafNode(parent)) {
        const _parent = { ...parent, style: { ...parent.style, [mark]: value } }
        Transforms.setNodes(editor, _parent as TBlockNode, { at: parentPath })
      }
    }
  }
  return editor
}
