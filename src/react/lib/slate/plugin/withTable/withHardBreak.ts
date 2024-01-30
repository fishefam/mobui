import type { NodeEntry } from 'slate'
import { isEditor } from 'slate'

import type { TBlockNode, TState } from '@/type/slate'
import { isBlockNode, isLeafNode } from '@/type/slate'

import { createTable } from './util'

export function withHardBreak(state: TState) {
  const { insertBreak, insertNode } = state

  state.insertBreak = () => {
    const { selection } = state
    if (selection) {
      const [row] = state.nodes({
        match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === 'table-row',
      })
      if (row) {
        const [node] = row
        if (isBlockNode(node)) {
          const end = state.end(selection)
          const currentRowPath = end.path.slice(0, -2)
          const [table] = state.parent(currentRowPath) as NodeEntry<TBlockNode>
          const lastRow = JSON.parse(JSON.stringify(node)) as TBlockNode
          const nextRowPath = [...currentRowPath.slice(0, -1), currentRowPath[currentRowPath.length - 1] + 1]
          const newRow = createTable(
            1,
            node.children.length,
            true,
            currentRowPath[currentRowPath.length - 1] === table.children.length - 1,
            lastRow,
          ).children[0]
          const currentCellPath = selection.focus.path.slice(0, -1)
          const nextCellPath = [
            ...currentCellPath.slice(0, -2),
            currentCellPath[currentCellPath.length - 2] + 1,
            currentCellPath[currentCellPath.length - 1],
          ]

          if (isBlockNode(newRow)) {
            insertNode(newRow, {
              at:
                currentRowPath[currentRowPath.length - 1] === table.children.length - 1 ? currentRowPath : nextRowPath,
            })
            const newPaths = new Array(node.children.length)
              .fill(selection.focus.path)
              .map((s, i) => [...s.slice(0, -3), s.slice(-3)[0] + 1, i, ...s.slice(-1)])

            for (const path of newPaths) state.delete({ at: path })
            state.select(nextCellPath)
            return
          }
        }
      }
    }
    insertBreak()
  }
}
