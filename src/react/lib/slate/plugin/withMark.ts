import { isEditor, Node, Transforms } from 'slate'
import { TBlockNode, TMark, TNode, TSlateEditor } from 'type/slate'

import { isLeafNode } from '..'
import { LIFTED_MARKS } from '../register'

export function withMark(state: TSlateEditor) {
  const { addMark } = state
  state.addMark = (mark, value) => {
    if (!LIFTED_MARKS.includes(mark as TMark)) {
      addMark(mark, value)
      return
    }

    const [node] = state.nodes({
      match: (node) => !isEditor(node) && isLeafNode(node),
    })
    if (node) {
      const [, path] = node
      const parent = Node.parent(state, path) as TNode
      const parentPath = path.slice(0, -1)
      if (!isLeafNode(parent)) {
        const _parent = { ...parent, style: { ...parent.style, [mark]: value } }
        Transforms.setNodes(state, _parent as TBlockNode, { at: parentPath })
      }
    }
  }
  return state
}
