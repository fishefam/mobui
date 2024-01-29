import type { BaseOperation } from 'slate'
import { TBlockNodeType, TNode, TSlateEditor } from 'type/slate'

import { isLeafNode } from '..'
import { BLOCK_NODES } from '../register'
import { generateNodeId } from '../util'

export function withNodeId(state: TSlateEditor) {
  const { apply } = state
  state.apply = (operation: BaseOperation) => {
    if (operation.type === 'split_node' && operation.position === 1) {
      const props = operation.properties as TNode
      if (!isLeafNode(props)) {
        const isBlockNode = Object.keys(BLOCK_NODES).includes(props.type as TBlockNodeType)
        if (isBlockNode) props.id = generateNodeId()
      }
    }
    return apply(operation)
  }
  return state
}
