import { BLOCK_NODES, INLINE_NODES, INLINE_VOID_NODES, NODES, VOID_NODES } from 'lib/slate/register'
import { CSSProperties, ReactNode } from 'react'
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, RenderElementProps as _RenderElementProps, RenderLeafProps as _RenderLeafProps } from 'slate-react'

export type TTrueMark = 'bold' | 'code' | 'italic' | 'kbd' | 'strikethrough' | 'subscript' | 'superscript' | 'underline'
export type TValueMark = keyof CSSProperties
export type TMark = TTrueMark | TValueMark

export type TText = { text: string }

export type TBlockNodeType = keyof typeof BLOCK_NODES
export type TInlineNodeType = keyof typeof INLINE_NODES
export type TVoidNodeType = keyof typeof VOID_NODES
export type TInlineVoidNodeType = keyof typeof INLINE_VOID_NODES
export type TNodeType = keyof typeof NODES

export type TCommonNodeProps<T extends string = never> = { attributes: { [key in T]: string }; id: string; style: CSSProperties }
export type TCommonNode<T, U extends string> = T & TCommonNodeProps<U>

export type TLeafNode<T extends TMark = never> = TText & { [key in T]?: T extends TTrueMark ? true : string }
export type TBlockNode<T extends string = never> = TCommonNode<{ children: (TBlockNode | TInlineNode | TLeafNode | TVoidNode)[]; type: TBlockNodeType }, T>
export type TInlineNode<T extends string = never> = TCommonNode<{ children: (TBlockNode | TInlineNode | TLeafNode)[]; type: TInlineNodeType }, T>
export type TVoidNode<T extends string = never> = TCommonNode<{ children: [TLeafNode]; type: TVoidNodeType; voidData?: { [key: string]: boolean | number | string } }, T>
export type TInlineVoidNode<T extends string = never> = TCommonNode<{ children: [TLeafNode]; type: TInlineVoidNodeType; voidData?: { [key: string]: boolean | number | string } }, T>

export type TNoneLeafNode<T extends string = never> = TBlockNode<T> | TInlineNode<T> | TInlineVoidNode<T> | TVoidNode<T>
export type TNode<T extends string = never> = TNoneLeafNode<T> | TLeafNode

export type TSlateEditor = BaseEditor & ReactEditor & HistoryEditor
export type TSlatePlugin = (editor: TSlateEditor) => TSlateEditor

export type TValue = TBlockNode[]

export type TRenderElement = (props: _RenderElementProps) => JSX.Element
export type TRenderLeaf = (props: _RenderElementProps) => JSX.Element

/* Type wrappers for Slate components */
export type TSlateEditorProps = {
  children: ReactNode
  editor: TSlateEditor
  initialValue: TValue
  onChange?: (value: TValue) => void
  onSelectionChange?: (selection: Selection) => void
  onValueChange?: (value: TValue) => void
}

declare module 'slate' {
  interface CustomTypes {
    Editor: TSlateEditor
    Element: TNoneLeafNode
    Text: TLeafNode<TMark>
  }
  interface RenderElementProps<T extends string = never> {
    attributes: _RenderElementProps['attributes']
    children: ReactNode
    element: Exclude<TNode<T>, 'TLeafNode'>
  }
  interface RenderLeafProps<T extends TMark = never> {
    attributes: _RenderLeafProps['attributes']
    children: ReactNode
    leaf: TLeafNode<T>
  }
}
