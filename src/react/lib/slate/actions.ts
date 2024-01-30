import type { Range } from 'slate'

import type { TBlockNode, TState, TVoidNode } from '@/type/slate'

export type TCallbackParams = {
  index: number
  node: TBlockNode | TVoidNode
}

export function onBlockSelection(state: TState, cb: (params: TCallbackParams) => void) {
  if (state.selection) {
    const { anchor, focus } = state.selection
    const [start, end] = [anchor, focus].sort(({ path: [anchorPath] }, { path: [focusPath] }) => anchorPath - focusPath)
    // generatePaths(state.selection)
    for (let index = start.path[0]; index <= end.path[0]; index++) {
      cb({ index, node: state.children[index] })
    }
  }
}

function generatePaths({ anchor, focus }: Range) {
  const a = [
    { offset: anchor.offset, path: anchor.path },
    { offset: focus.offset, path: focus.path },
  ]
  console.log(a)
}
