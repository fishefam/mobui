import type { TState } from '@/type/slate'
import type { TextUnit } from 'slate'

import { isBlockNode, isLeafNode } from '@/type/slate'
import { isEditor, Path, Point } from 'slate'

export function withDeleteBackward(state: TState) {
  const { deleteForward } = state
  state.deleteForward = (unit: TextUnit) => {
    const { selection } = state
    if (selection) {
      const [cell] = state.nodes({
        match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === 'table-cell',
      })
      if (cell) {
        const [, path] = cell
        const start = state.end(path)
        if (Point.equals(start, selection.anchor)) return
      }

      try {
        const [currentNode] = state.parent(state.node(selection)[1])
        const [afterNode, afterNodePath] = state.parent(state.first(Path.next(selection.focus.path.slice(0, -1)))[1])
        if (
          isBlockNode(afterNode) &&
          isBlockNode(currentNode) &&
          afterNode.type === 'table-cell' &&
          !['table', 'table-cell', 'table-row'].includes(currentNode.type)
        ) {
          const [, rootPath] = state.parent(afterNodePath, { depth: 2 })
          state.delete({ at: rootPath })
          return
        }
      } catch {
        /* empty */
      }
    }
    deleteForward(unit)
  }
}
