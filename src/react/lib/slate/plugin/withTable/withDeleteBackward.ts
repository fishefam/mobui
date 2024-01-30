import type { TextUnit } from 'slate'
import { isEditor, Path, Point } from 'slate'

import type { TState } from '@/type/slate'
import { isBlockNode, isLeafNode } from '@/type/slate'

export function withDeleteForward(state: TState) {
  const { deleteBackward } = state
  state.deleteBackward = (unit: TextUnit) => {
    const { selection } = state
    if (selection) {
      const [cell] = state.nodes({
        match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === 'table-cell',
      })
      if (cell) {
        const [, path] = cell
        const start = state.start(path)
        if (Point.equals(start, selection.anchor)) return
      }

      try {
        const [currentNode] = state.parent(state.node(selection)[1])
        const [beforeNode, beforeNodePath] = state.parent(
          state.first(Path.previous(selection.focus.path.slice(0, -1)))[1],
        )
        if (
          isBlockNode(beforeNode) &&
          isBlockNode(currentNode) &&
          beforeNode.type === 'table-cell' &&
          !['table', 'table-cell', 'table-row'].includes(currentNode.type)
        ) {
          const [, rootPath] = state.parent(beforeNodePath, { depth: 2 })
          state.delete({ at: rootPath })
          return
        }
      } catch {
        /* empty */
      }
    }
    deleteBackward(unit)
  }
}
