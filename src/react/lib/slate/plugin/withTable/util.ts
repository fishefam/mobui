import type { TBlockNode } from '@/type/slate'
import { isBlockNode } from '@/type/slate'

import { generateNodeId } from '../../util'

export function createTable(
  rows: number,
  cols: number,
  oneRowOnly = false,
  isLastRow = false,
  refRow?: TBlockNode,
): TBlockNode {
  const table: TBlockNode = {
    attrs: {},
    children: createRows(rows, cols),
    id: generateNodeId(),
    style: { borderCollapse: 'separate', borderSpacing: 0, width: '100%' },
    type: 'table',
  }

  const tableRows = table.children as TBlockNode[]

  if (!oneRowOnly) {
    const topLeftCell = tableRows[0].children[0]
    const topRightCell = tableRows[0].children[tableRows[0].children.length - 1]
    const bottomLeftCell = tableRows[tableRows.length - 1].children[0]
    const bottomRightCell =
      tableRows[tableRows.length - 1].children[tableRows[tableRows.length - 1].children.length - 1]

    if (isBlockNode(topLeftCell)) topLeftCell.style = { ...topLeftCell.style, borderTopLeftRadius: '0.5rem' }
    if (isBlockNode(topRightCell)) topRightCell.style = { ...topRightCell.style, borderTopRightRadius: '0.5rem' }
    if (isBlockNode(bottomLeftCell))
      bottomLeftCell.style = { ...bottomLeftCell.style, borderBottomLeftRadius: '0.5rem' }
    if (isBlockNode(bottomRightCell))
      bottomRightCell.style = { ...bottomRightCell.style, borderBottomRightRadius: '0.5rem' }

    for (const cell of tableRows[0].children as TBlockNode[]) cell.style = { ...cell.style, borderTopWidth: '0.2rem' }
    for (const cell of tableRows[tableRows.length - 1].children as TBlockNode[])
      cell.style = { ...cell.style, borderBottomWidth: '0.2rem' }
    for (const row of tableRows) {
      const leftCell = row.children[0]
      const rightCell = row.children[row.children.length - 1]
      if (isBlockNode(leftCell) && isBlockNode(rightCell)) {
        leftCell.style = { ...leftCell.style, borderLeftWidth: '0.2rem' }
        rightCell.style = { ...rightCell.style, borderRightWidth: '0.2rem' }
      }
    }
  }

  if (oneRowOnly) {
    if (refRow && isLastRow) tableRows[0] = { ...refRow }
    const leftCell = tableRows[0].children[0]
    const rightCell = tableRows[0].children[tableRows[0].children.length - 1]

    if (isBlockNode(leftCell) && isBlockNode(rightCell)) {
      leftCell.style = {
        ...leftCell.style,
        borderLeftWidth: '0.2rem',
      }
      rightCell.style = {
        ...rightCell.style,
        borderRightWidth: '0.2rem',
      }
    }

    if (isLastRow)
      for (const row of tableRows[0].children)
        if (isBlockNode(row)) row.style = { ...row.style, borderBottomWidth: '0.05rem', borderRadius: 0 }
  }
  return table
}

export function createRows(rows: number, cols: number) {
  const result: TBlockNode[] = []
  for (let i = 0; i < rows; i++)
    result.push({
      attrs: {},
      children: createCells(cols),
      id: generateNodeId(),
      style: {},
      type: 'table-row',
    })

  return result
}

export function createCells(cols: number) {
  const result: TBlockNode[] = []
  for (let i = 0; i < cols; i++)
    result.push({
      attrs: {},
      children: [{ text: '' }],
      id: generateNodeId(),
      style: { border: 'solid 0.05px', padding: '1rem 0', textAlign: 'center' },
      type: 'table-cell',
    })
  return result
}
