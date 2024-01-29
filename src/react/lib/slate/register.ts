import { BaseElement } from 'component/slate/BaseElement'
import { MarkLeaf } from 'component/slate/MarkLeaf'
import { ReactElement } from 'react'
import { TMark, TTrueMark, TValueMark } from 'type/slate'

export const BLOCK_NODES = {
  'blockquote': BaseElement,
  'code-block': BaseElement,
  'code-line': BaseElement,
  'heading-1': BaseElement,
  'heading-2': BaseElement,
  'heading-3': BaseElement,
  'heading-4': BaseElement,
  'heading-5': BaseElement,
  'heading-6': BaseElement,
  'ordered-list': BaseElement,
  'paragraph': BaseElement,
  'tabbable': BaseElement,
  // 'table': TableElement,
  // 'table-cell': TableCellElement,
  'table-header': BaseElement,
  // 'table-row': TableRowElement,
  'todo': BaseElement,
  'unordered-list': BaseElement,
} as const

export const INLINE_NODES = {
  'code-syntax': BaseElement,
  // 'link': LinkElement,
  'mention': BaseElement,
} as const

export const VOID_NODES = {
  'block-image': BaseElement,
  'divider': BaseElement,
  'excalidraw': BaseElement,
  'video': BaseElement,
} as const

export const INLINE_VOID_NODES = {
  'inline-image': BaseElement,
  // 'latex': LatexElement,
} as const

export const TRUE_MARKS = {
  bold: MarkLeaf,
  code: MarkLeaf,
  italic: MarkLeaf,
  kbd: MarkLeaf,
  strikethrough: MarkLeaf,
  subscript: MarkLeaf,
  superscript: MarkLeaf,
  underline: MarkLeaf,
} as { [key in TTrueMark]: () => ReactElement }

export const VALUE_MARKS = {
  backgroundColor: MarkLeaf,
  color: MarkLeaf,
  textAlign: MarkLeaf,
} as { [key in TValueMark]: () => ReactElement }

export const NODES = { ...BLOCK_NODES, ...INLINE_NODES, ...VOID_NODES, ...INLINE_VOID_NODES }
export const MARKS = { ...TRUE_MARKS, ...VALUE_MARKS }
export const LIFTED_MARKS: TMark[] = ['textAlign']
