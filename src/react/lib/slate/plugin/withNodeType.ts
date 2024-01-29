import { TInlineNodeType, TNode, TSlateEditor } from 'type/slate'

import { isLeafNode } from '..'
import { INLINE_NODES, INLINE_VOID_NODES, VOID_NODES } from '../register'

export function withNodeType(state: TSlateEditor) {
  const { isInline, isVoid } = state
  state.isInline = (node: TNode) => {
    if (
      !isLeafNode(node) &&
      Object.keys({ ...INLINE_NODES, ...INLINE_VOID_NODES }).includes(node.type as TInlineNodeType)
    )
      return true
    if (isLeafNode(node)) return false
    return isInline(node)
  }
  state.isVoid = (node: TNode) => {
    if (!isLeafNode(node) && Object.keys({ ...VOID_NODES, ...INLINE_VOID_NODES }).includes(node.type)) return true
    if (isLeafNode(node)) return false
    return isVoid(node)
  }
  return state
}
