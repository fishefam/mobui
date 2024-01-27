import type { TMark } from '@/type/slate'

import { BaseElement } from '@/component/slate/block/BaseElement'
import { TableCellElement, TableElement, TableRowElement } from '@/component/slate/block/TableElement'
import { LinkElement } from '@/component/slate/inline/LinkElement'
import { TrueMarkLeaf, ValueMarkLeaf } from '@/component/slate/leaf/MarkLeaf'
import { LatexElement } from '@/component/slate/void/LatexElement'

import { withMark } from './plugin/withMark'
import { withNodeId } from './plugin/withNodeId'
import { withNodeType } from './plugin/withNodeType'
import { withTable } from './plugin/withTable'

export const SLATE_PLUGINS = [withNodeId, withNodeType, withTable, withMark]

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
  'table': TableElement,
  'table-cell': TableCellElement,
  'table-header': BaseElement,
  'table-row': TableRowElement,
  'todo': BaseElement,
  'unordered-list': BaseElement,
} as const

export const INLINE_NODES = {
  'code-syntax': BaseElement,
  'link': LinkElement,
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
  'latex': LatexElement,
} as const

export const TRUE_MARKS = {
  bold: TrueMarkLeaf,
  code: TrueMarkLeaf,
  italic: TrueMarkLeaf,
  kbd: TrueMarkLeaf,
  strikethrough: TrueMarkLeaf,
  subscript: TrueMarkLeaf,
  superscript: TrueMarkLeaf,
  underline: TrueMarkLeaf,
} as const

export const VALUE_MARKS = {
  textAlign: ValueMarkLeaf,
} as const

export const NODES = { ...BLOCK_NODES, ...INLINE_NODES, ...VOID_NODES, ...INLINE_VOID_NODES }
export const MARKS = { ...TRUE_MARKS, ...VALUE_MARKS }
export const LIFTED_MARKS: TMark[] = ['textAlign']