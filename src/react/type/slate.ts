/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { CSSProperties, ReactNode } from 'react'
import type { BaseEditor as _BaseEditor, Selection } from 'slate'
import { createEditor as _createEditor } from 'slate'
import type { HistoryEditor as _HistoryEditor } from 'slate-history'
import { withHistory as _withHistory } from 'slate-history'
import type { RenderElementProps as _RenderElementProps, RenderLeafProps as _RenderLeafProps } from 'slate-react'
import { ReactEditor as _ReactEditor, Slate as _Slate, withReact as _withReact } from 'slate-react'

import type { INLINE_VOID_NODES, NODES } from '@/lib/slate/register'
import { BLOCK_NODES, INLINE_NODES, VOID_NODES } from '@/lib/slate/register'
import { generateNodeId } from '@/lib/slate/util'

export type TBlockNodeType = keyof typeof BLOCK_NODES
export type TInlineNodeType = keyof typeof INLINE_NODES
export type TVoidNodeType = keyof typeof VOID_NODES
export type TInlineVoidNodeType = keyof typeof INLINE_VOID_NODES
export type TNodeType = keyof typeof NODES

export type TTrueMark = 'bold' | 'code' | 'italic' | 'kbd' | 'strikethrough' | 'subscript' | 'superscript' | 'underline'
export type TValueMark = keyof CSSProperties
export type TMark = TTrueMark | TValueMark

export type TText = { text: string }

export type TCommonNodeProps<T extends string = never> = {
  attrs: { [key in T]: string }
  id: string
  style: CSSProperties
}

export type TLeafNode<T extends TTrueMark = never, U extends TValueMark = never> = TText & {
  [key in T]?: true
} & { [key in U]?: string }
export type TBlockNode<T extends string = never> = {
  children: (TBlockNode | TInlineNode | TLeafNode | TVoidNode)[]
  type: TBlockNodeType
} & TCommonNodeProps<T>
export type TInlineNode<T extends string = never> = {
  children: (TBlockNode | TInlineNode | TLeafNode)[]
  type: TInlineNodeType
} & TCommonNodeProps<T>
export type TVoidNode<T extends string = never> = {
  children: [TLeafNode]
  type: TVoidNodeType
  voidData?: { [key: string]: boolean | number | string }
} & TCommonNodeProps<T>
export type TInlineVoidNode<T extends string = never> = {
  children: [TLeafNode]
  type: TInlineVoidNodeType
  voidData?: { [key: string]: boolean | number | string }
} & TCommonNodeProps<T>
export type TNode<T extends string = never> =
  | TBlockNode<T>
  | TInlineNode<T>
  | TInlineVoidNode<T>
  | TLeafNode
  | TVoidNode<T>

export type TState = Omit<_BaseEditor & _ReactEditor & _HistoryEditor, 'addMark' | 'children'> & {
  addMark: (key: TMark, value: string | true) => void
  children: (TBlockNode | TVoidNode)[]
}
export type TValue = TBlockNode[]

export type TOperationProps = Omit<TNode, 'children'>
export type TPlugin = (state: TState) => TState
export type TRenderElement = (props: _RenderElementProps) => JSX.Element
export type TRenderLeaf = (props: _RenderElementProps) => JSX.Element

declare module 'slate' {
  interface CustomTypes {
    Editor: TState
    Element: TBlockNode | TInlineNode | TInlineVoidNode | TVoidNode
    Text: TLeafNode<TTrueMark, TValueMark>
  }
  interface RenderElementProps<T extends string = never> {
    attributes: _RenderElementProps['attributes']
    children: ReactNode
    element: TBlockNode<T> | TInlineNode<T> | TVoidNode<T>
  }
  interface RenderLeafProps<T extends TTrueMark = never, U extends TValueMark = never> {
    attributes: _RenderLeafProps['attributes']
    children: ReactNode
    leaf: TLeafNode<T, U>
  }
}

/* Type wrappers for Slate components and functions */
export type TStateProps = {
  children: ReactNode
  editor: TState
  initialValue: TValue
  onChange?: (value: TValue) => void
  onSelectionChange?: (selection: Selection) => void
  onValueChange?: (value: TValue) => void
}
export const ReactEditor = _ReactEditor as Omit<typeof _ReactEditor, 'focus'> & {
  focus: (editor: TState, options?: { retries: number }) => void
}
export const Slate = _Slate as (props: TStateProps) => JSX.Element
export const withReact = _withReact as (editor: TState, clipboardFormatKey?: string) => TState
export const withHistory = _withHistory as TPlugin
export const createState: (plugins: TPlugin[]) => TState = (plugins) => {
  let state = withHistory(withReact(_createEditor()))
  plugins.forEach((plugin) => (state = plugin(state)))
  return state
}

/* Check functions */
export function isBlockNodeType(type: TNodeType): type is TBlockNodeType {
  return Object.keys(BLOCK_NODES).includes(type as TBlockNodeType)
}
export function isInlineNodeType(type: TNodeType): type is TInlineNodeType {
  return Object.keys(INLINE_NODES).includes(type as TInlineNodeType)
}
export function isVoidNodeType(type: TNodeType): type is TVoidNodeType {
  return Object.keys(VOID_NODES).includes(type as TVoidNodeType)
}

export function isLeafNode(node: Record<string, unknown>): node is TLeafNode {
  return typeof node.text === 'string'
}
export function isBlockNode(node: Record<string, unknown>): node is TBlockNode {
  const hasType = !!node.type
  const hasChildren = !!node.children
  const isBlockNodeType = Object.keys(BLOCK_NODES).includes(node.type as TBlockNodeType)
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

/* Helper functions */
export function createBlockNode(): TBlockNode {
  return { attrs: {}, children: [{ text: '' }], id: generateNodeId(), style: {}, type: 'paragraph' }
}
