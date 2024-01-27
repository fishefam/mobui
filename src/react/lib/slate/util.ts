import type { CSSProperties } from 'react'
import hash from 'shorthash2'
import type { BaseRange, NodeEntry } from 'slate'
import { isEditor } from 'slate'

import type {
  TBlockNode,
  TBlockNodeType,
  TInlineVoidNode,
  TInlineVoidNodeType,
  TLeafNode,
  TState,
  TTrueMark,
  TVoidNodeType,
} from '@/type/slate'
import { isLeafNode } from '@/type/slate'

import { getInfo_RawData } from '../data'
import { nanoid } from '../util'

export function generateNodeId() {
  const { uid } = getInfo_RawData()
  return `${hash(uid?.length ? uid : nanoid(5))}-${nanoid()}`
}

export function checkSelection(state: TState, cb: (selection: BaseRange) => unknown) {
  const { selection } = state
  if (selection) cb(selection)
}

export function retrieveNode<
  T extends TBlockNodeType | TInlineVoidNodeType | TVoidNodeType = TBlockNodeType,
>(state: TState, nodeType: T) {
  const [nodeEntry] = state.nodes<
    T extends TBlockNodeType
      ? TBlockNode
      : T extends TInlineVoidNodeType
        ? TInlineVoidNode
        : TBlockNode
  >({
    match: (node) => !isEditor(node) && !isLeafNode(node) && node.type === nodeType,
  })
  return nodeEntry as
    | NodeEntry<
        T extends TBlockNodeType
          ? TBlockNode
          : T extends TInlineVoidNodeType
            ? TInlineVoidNode
            : TBlockNode
      >
    | undefined
}

export function retrieveLeafNode(state: TState) {
  const [nodeEntry] = state.nodes<TLeafNode<TTrueMark, keyof CSSProperties>>({
    match: (node) => !isEditor(node) && isLeafNode(node),
  })
  return nodeEntry
}
