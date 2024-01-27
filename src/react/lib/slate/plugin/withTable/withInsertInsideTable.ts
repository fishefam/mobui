import type { TState } from '@/type/slate'

import { isBlockNode } from '@/type/slate'
import { isEditor } from 'slate'

export function withInsertInsideTable(state: TState) {
  const { insertFragment } = state

  state.insertFragment = (fragment) => {
    const { selection } = state
    if (selection) {
      const [table] = state.nodes({
        match: (node) => !isEditor(node) && isBlockNode(node) && node.type === 'table',
      })
      if (table) {
        insertFragment(fragment, { at: [selection.focus.path[0] + 1] })
        return
      }
    }
    insertFragment(fragment)
  }
}
