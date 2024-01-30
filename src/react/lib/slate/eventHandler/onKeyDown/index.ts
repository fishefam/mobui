import type { KeyboardEvent } from 'react'

import type { TState } from '@/type/slate'

import { handleDefault_text, handleTab_text } from './handleText'

type THandleKeyDownProps = { container: HTMLElement | null; event: KeyboardEvent; state: TState }

const SPECIAL_KEYS = ['Tab']

export function handleKeyDown({ container, event, state }: THandleKeyDownProps) {
  const focusedElement = document.activeElement?.parentElement?.parentElement
  if (focusedElement === container && SPECIAL_KEYS.includes(event.key)) event.preventDefault()

  if (event.key === 'Tab') {
    handleTab_text(state)
    return
  }

  handleDefault_text(state, event.key)
  // if (selection) {
  //   const [[table]] = state.nodes({
  //     match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === 'table',
  //   })

  //   if (table && event.key === 'Tab') {
  //     const [[row]] = state.nodes({
  //       match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === 'table-row',
  //     })
  //     const currentPath = selection.focus.path
  //     const rowPoint = currentPath[currentPath.length - 3]
  //     const cellPoint = currentPath[currentPath.length - 2]
  //     const rowNum = isBlockNode(table) ? table.children.length : 0
  //     const cellNum = isBlockNode(row) ? row.children.length : 0

  //     if (rowPoint < rowNum - 1 || (rowPoint === rowNum - 1 && cellPoint < cellNum - 1)) {
  //       event.preventDefault()
  //       const prefixPoints = currentPath.slice(0, -3)
  //       const nextRowPoint =
  //         cellPoint === cellNum - 1 && rowPoint < rowNum - 1 ? rowPoint + 1 : rowPoint
  //       const nextCellPoint = cellPoint < cellNum - 1 ? cellPoint + 1 : 0
  //       const nextPath = [...prefixPoints, nextRowPoint, nextCellPoint, 0]
  //       state.select(nextPath)
  //     }
  //   }
  // }
}
