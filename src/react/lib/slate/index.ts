import { ReactElement } from 'react'
import { createEditor, Node } from 'slate'
import { Transforms as _Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { ReactEditor as _ReactEditor, Slate as _Slate, withReact } from 'slate-react'
import { TObject } from 'type/common'
import {
  TBlockNode,
  TBlockNodeType,
  TInlineNode,
  TInlineNodeType,
  TLeafNode,
  TNodeType,
  TSlateEditor,
  TSlateEditorProps,
  TSlatePlugin,
  TVoidNode,
  TVoidNodeType,
} from 'type/slate'

import withBlockTypeChange from './plugin/withBlockTypeChange'
import withList from './plugin/withList'
import withMark from './plugin/withMark'
import withNodeId from './plugin/withNodeId'
import withNodeType from './plugin/withNodeType'
import withPlaceholder from './plugin/withPlaceholder'
import { BLOCK_NODES, INLINE_NODES, VOID_NODES } from './register'

const PLUGINS: TSlatePlugin[] = [withNodeType, withMark, withNodeId, withList, withBlockTypeChange, withPlaceholder]

export const Slate = _Slate as (props: TSlateEditorProps) => ReactElement
export const ReactEditor = _ReactEditor as Omit<typeof _ReactEditor, 'focus'> & {
  focus: (editor: TSlateEditor, options?: { retries: number }) => void
}
export const Transforms = { ..._Transforms, changeBlockType }

export function createSlateEditor() {
  let baseEditor = createEditor()
  for (const plugin of PLUGINS) baseEditor = plugin(baseEditor)
  return withReact(withHistory(baseEditor)) as TSlateEditor
}

/* Check functions: Node Type */
export function isBlockNodeType(type: TNodeType): type is TBlockNodeType {
  return Object.keys(BLOCK_NODES).includes(type as TBlockNodeType)
}
export function isInlineNodeType(type: TNodeType): type is TInlineNodeType {
  return Object.keys(INLINE_NODES).includes(type as TInlineNodeType)
}
export function isVoidNodeType(type: TNodeType): type is TVoidNodeType {
  return Object.keys(VOID_NODES).includes(type as TVoidNodeType)
}

/* Check functions: Node */
export function isLeafNode(node: Record<string, unknown>): node is TLeafNode {
  return typeof node.text === 'string'
}
export function isBlockNode(node: Record<string, unknown> | TSlateEditor): node is TBlockNode {
  const hasType = !!(node as { type: unknown }).type
  const hasChildren = !!node.children
  const isBlockNodeType = Object.keys(BLOCK_NODES).includes((node as { type: unknown }).type as TBlockNodeType)
  return hasType && hasChildren && isBlockNodeType
}
export function isInlineNode(node: Record<string, unknown>): node is TInlineNode {
  const hasType = !!node.type
  const hasChildren = !!node.children
  const isInlineNodeType = Object.keys(INLINE_NODES).includes(node.type as TInlineNodeType)
  return hasType && hasChildren && isInlineNodeType
}
export function isVoidNode(node: Record<string, unknown>): node is TVoidNode {
  const hasType = !!node.type
  const hasChildren = !!node.children
  const isVoidNodeType = Object.keys(VOID_NODES).includes(node.type as TVoidNodeType)
  return hasType && hasChildren && isVoidNodeType
}

export function hasTypeProp(property: Partial<Node>): property is { type: TNodeType } {
  return !!(property as TObject).type
}

/* Addon functions for Transform namespace */
function changeBlockType(editor: TSlateEditor, nextType: TBlockNodeType) {
  const { selection } = editor
  if (selection) {
    const node = Node.get(editor, selection.anchor.path.slice(0, -1))
    if (isBlockNode(node)) {
      editor.setNodes({ nextType, previousType: node.type })
      editor.setNodes({ nextType: undefined })
    }
  }
}
