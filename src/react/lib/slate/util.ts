import type { BaseRange, NodeEntry } from 'slate'
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

export function generateNodeId() {
  const hash = localStorage.getItem('uidHash')!
  return `${hash.length ? hash : nanoid(5)}-${nanoid()}`
}

export function checkSelection(state: TSlateEditor, cb: (selection: BaseRange) => unknown) {
  const { selection } = state
  if (selection) cb(selection)
}

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

export function retrieveLeafNode(state: TSlateEditor) {
  const [nodeEntry] = state.nodes<TLeafNode<TMark>>({
    match: (node) => !isEditor(node) && isLeafNode(node),
  })
  return nodeEntry
}

export function createBlockNode(type: TBlockNodeType = 'paragraph', text = ''): TBlockNode {
  return {
    attributes: {},
    children: [{ text }],
    id: generateNodeId(),
    placeholder: 'Start typing...',
    previousType: type,
    style: {},
    type,
  }
}
