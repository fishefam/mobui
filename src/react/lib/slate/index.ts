import { hasProps } from 'lib/util'
import { ReactElement } from 'react'
import { BaseOperation, createEditor, SetNodeOperation } from 'slate'
import { Transforms as _Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { ReactEditor as _ReactEditor, Slate as _Slate, withReact } from 'slate-react'
import {
  TBlockNode,
  TBlockNodeType,
  TInlineNode,
  TInlineNodeType,
  TLeafNode,
  TNodeType,
  TPluginNodeProps,
  TSetNodeOperation,
  TSlateEditor,
  TSlateEditorProps,
  TSlatePlugin,
  TVoidNode,
  TVoidNodeType,
} from 'type/slate'

import withBlockTypeChange from './plugin/withBlockTypeChange'
import withList from './plugin/withList'
import { BLOCK_NODES, INLINE_NODES, VOID_NODES } from './register'

const PLUGINS: TSlatePlugin[] = [withBlockTypeChange, withList]

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

export function isOperation<
  U extends BaseOperation,
  T extends BaseOperation['type'] =
    | 'insert_node'
    | 'insert_text'
    | 'merge_node'
    | 'move_node'
    | 'remove_node'
    | 'remove_text'
    | 'set_node'
    | 'set_selection'
    | 'split_node',
>(types: T[], operation: BaseOperation): operation is U {
  return getOperations(...types).includes(operation.type)
}

export function isSetNodeOperation<T extends keyof TPluginNodeProps>(
  keys: T[],
  operation: BaseOperation,
): operation is TSetNodeOperation {
  return (
    isOperation<SetNodeOperation>(['set_node'], operation) &&
    hasProps<T, TPluginNodeProps[T]>(keys, operation.newProperties)
  )
}

export function getOperations<T extends BaseOperation['type']>(...types: T[]) {
  return [
    'insert_node',
    'insert_text',
    'merge_node',
    'move_node',
    'remove_node',
    'remove_text',
    'set_node',
    'set_selection',
    'split_node',
  ].filter((v) => types.includes(v as T))
}

/* Addon functions for Transform namespace */
function changeBlockType(
  editor: TSlateEditor,
  nextType: TBlockNodeType,
  optional: { wrapperListType?: TBlockNodeType } = {},
) {
  const { selection } = editor
  const { wrapperListType } = optional
  if (selection) editor.setNodes({ nextType, wrapperListType })
}
