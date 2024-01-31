import { CSSProperties } from 'react'
import type { BaseRange, NodeEntry, Path } from 'slate'
import { isEditor } from 'slate'
import {
  TBlockNode,
  TBlockNodeType,
  TInlineVoidNode,
  TInlineVoidNodeType,
  TLeafNode,
  TMark,
  TSlateEditor,
  TVoidNodeType,
} from 'type/slate'

import { nanoid } from '../util'
import { isLeafNode } from '.'

type TGetSelectionSliceReturn<T extends 'anchor' | 'focus' | 'pair'> = T extends 'pair'
  ? { [key in 'anchor' | 'focus']: Path }
  : Path

/**
 * Generates a unique node ID by combining a hash from localStorage and a random identifier.
 * @returns A unique node ID.
 */
export function generateNodeId() {
  const hash = localStorage.getItem('uidHash')!
  return `node-${hash.length ? hash : nanoid(5)}-${nanoid()}`
}

/**
 * Checks the current selection in the editor and invokes a callback if a selection is present.
 * @param state - The Slate.js editor state.
 * @param cb - The callback function to be invoked with the selection.
 */
export function checkSelection(state: TSlateEditor, cb: (selection: BaseRange) => unknown) {
  const { selection } = state
  if (selection) cb(selection)
}

/**
 * Retrieves a node of a specified type from the Slate.js editor.
 * @param state - The Slate.js editor state.
 * @param nodeType - The type of the node to retrieve.
 * @returns The entry of the retrieved node, if found.
 */
export function retrieveNode<T extends TBlockNodeType | TInlineVoidNodeType | TVoidNodeType = TBlockNodeType>(
  state: TSlateEditor,
  nodeType: T,
) {
  const [nodeEntry] = state.nodes<
    T extends TBlockNodeType ? TBlockNode : T extends TInlineVoidNodeType ? TInlineVoidNode : TBlockNode
  >({
    match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === nodeType,
  })
  return nodeEntry as
    | NodeEntry<T extends TBlockNodeType ? TBlockNode : T extends TInlineVoidNodeType ? TInlineVoidNode : TBlockNode>
    | undefined
}

/**
 * Retrieves a leaf node from the Slate.js editor.
 * @param state - The Slate.js editor state.
 * @returns The entry of the retrieved leaf node, if found.
 */
export function retrieveLeafNode(state: TSlateEditor) {
  const [nodeEntry] = state.nodes<TLeafNode<TMark>>({
    match: (node) => !isEditor(node) && isLeafNode(node),
  })
  return nodeEntry
}

/**
 * Creates a new block node with the specified type and text.
 * @param type - The type of the block node (default: 'paragraph').
 * @param text - The text content of the block node (default: '').
 * @returns A new block node.
 */
export function createBlockNode({
  style = {},
  text = '',
  type = 'paragraph',
}: {
  style?: CSSProperties
  text?: string
  type?: TBlockNodeType
}): TBlockNode {
  return {
    attributes: {},
    children: [{ text }],
    id: generateNodeId(),
    placeholder: 'Start typing...',
    previousType: type,
    style,
    type,
  }
}

/**
 * Gets a slice of the current selection path in the editor.
 * @param editor - The Slate.js editor.
 * @param type - The type of return value.
 * @param from - The starting index of the selection path slice.
 * @param to - The ending index of the selection path slice.
 * @returns The sliced selection path.
 */
export function getSelectionSlice<T extends 'anchor' | 'focus' | 'pair'>(
  editor: TSlateEditor,
  type: T,
  from?: number,
  to?: number,
): TGetSelectionSliceReturn<T> {
  if (type !== 'pair')
    return (editor.selection?.[type as Exclude<T, 'pair'>].path.slice(from, to) ?? []) as TGetSelectionSliceReturn<T>
  return {
    anchor: editor.selection?.anchor.path.slice(from, to) ?? [],
    focus: editor.selection?.focus.path.slice(from, to) ?? [],
  } as TGetSelectionSliceReturn<T>
}
