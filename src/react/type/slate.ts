import { BLOCK_NODES, INLINE_NODES, INLINE_VOID_NODES, NODES, VOID_NODES } from 'lib/slate/register'
import { CSSProperties, ReactNode } from 'react'
import { BaseEditor, SetNodeOperation } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, RenderElementProps as _RenderElementProps, RenderLeafProps as _RenderLeafProps } from 'slate-react'

import { TObject } from './common'

/**
 * Custom Types for Slate.js Integration
 *
 * - `TTrueMark`: Represents marks that only accept the value true for text formatting.
 * - `TValueMark`: Represents marks related to CSS properties.
 * - `TMark`: Represents the union type of true marks and value marks.
 * - `TText`: Represents a text node in Slate.js with additional text-related information.
 *
 * - `TBlockNodeType`, `TInlineNodeType`, `TVoidNodeType`, `TInlineVoidNodeType`: Enumerates the node types for different Slate.js nodes.
 * - `TNodeType`: Enumerates all Slate.js node types.
 *
 * - `TPluginNodeProps`: Common props for Slate.js plugin nodes.
 * - `TCommonNodeProps<T>`: Common props for Slate.js nodes.
 * - `TCommonNode<T, U>`: Represents a common structure for Slate.js nodes with children and specific props.
 *
 * - `TLeafNode<T>`: Represents a leaf node in Slate.js with additional information related to text formatting.
 * - `TBlockNode<T>`, `TInlineNode<T>`, `TVoidNode<T>`, `TInlineVoidNode<T>`: Represents different types of Slate.js nodes with children.
 *
 * - `TNoneLeafNode<T>`: Represents Slate.js nodes that are not leaf nodes.
 * - `TNode<T>`: Represents a generic Slate.js node with optional type `T`.
 *
 * - `TSlateEditor`, `TSlatePlugin`: Represents the Slate.js editor and a Slate.js plugin.
 * - `TValue`: Represents the value (content) of the Slate.js editor.
 *
 * - `TRenderElement`, `TRenderLeaf`: Types for rendering Slate.js elements and leaves.
 *
 * - `TSetNodeOperation<T>`: Represents a set node operation with additional properties of type `T`.
 *
 * - `TSlateEditorProps`: Props for the Slate.js editor component.
 *
 * - Type wrappers for Slate components.
 *
 */

export type TTrueMark = 'bold' | 'code' | 'italic' | 'kbd' | 'strikethrough' | 'subscript' | 'superscript' | 'underline'
export type TValueMark = keyof CSSProperties
export type TMark = TTrueMark | TValueMark

export type TText = { text: string }

export type TBlockNodeType = keyof typeof BLOCK_NODES
export type TInlineNodeType = keyof typeof INLINE_NODES
export type TVoidNodeType = keyof typeof VOID_NODES
export type TInlineVoidNodeType = keyof typeof INLINE_VOID_NODES
export type TNodeType = keyof typeof NODES

export type TPluginNodeProps = { className: string; keepCurrentType: boolean; nextType: TBlockNodeType; wrapperListType: TBlockNodeType }
export type TCommonNodeProps<T extends string = never> = { attributes: TObject<T>; id: string; placeholder: string; previousType: TBlockNodeType; style: CSSProperties } & Partial<TPluginNodeProps>
export type TCommonNode<T, U extends string> = T & TCommonNodeProps<U>

export type TLeafNode<T extends TMark = never> = TText & Partial<{ [key in T]: T extends TTrueMark ? true : string }>
export type TBlockNode<T extends string = never> = TCommonNode<{ children: (TBlockNode | TInlineNode | TLeafNode | TVoidNode)[]; type: TBlockNodeType }, T>
export type TInlineNode<T extends string = never> = TCommonNode<{ children: (TBlockNode | TInlineNode | TLeafNode)[]; type: TInlineNodeType }, T>
export type TVoidNode<T extends string = never> = TCommonNode<{ children: [TLeafNode]; type: TVoidNodeType; voidData?: { [key: string]: boolean | number | string } }, T>
export type TInlineVoidNode<T extends string = never> = TCommonNode<{ children: [TLeafNode]; type: TInlineVoidNodeType; voidData?: { [key: string]: boolean | number | string } }, T>

export type TNoneLeafNode<T extends string = never> = TBlockNode<T> | TInlineNode<T> | TInlineVoidNode<T> | TVoidNode<T>
export type TNode<T extends string = never> = TLeafNode | TNoneLeafNode<T>

export type TSlateEditor = BaseEditor & ReactEditor & HistoryEditor
export type TSlatePlugin = (editor: TSlateEditor) => TSlateEditor

export type TValue = TBlockNode[]

export type TRenderElement = (props: _RenderElementProps) => JSX.Element
export type TRenderLeaf = (props: _RenderElementProps) => JSX.Element

export type TSetNodeOperation<T = TPluginNodeProps> = SetNodeOperation & { [key in 'newProperties' | 'properties']: Partial<T> }

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
