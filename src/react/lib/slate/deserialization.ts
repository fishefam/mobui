import { createElement } from 'lib/dom'
import { namedNodeMapToReactAttribute, snakeToCamel } from 'lib/util'
import { GET_TYPING_PLACEHOLDER } from 'react/constant'
import { createText, jsx } from 'slate-hyperscript'
import {
  createAnchor,
  createCursor,
  createFocus,
  createFragment,
  createSelection,
} from 'slate-hyperscript/dist/creators'
import parseStyle from 'style-to-object'
import { TNodeName, TObject } from 'type/common'
import {
  TBlockNodeType,
  TCommonNodeProps,
  TLeafNode,
  TMark,
  TNode,
  TNodeType,
  TNoneLeafNode,
  TSlateEditor,
  TTrueMark,
  TValue,
  TValueMark,
} from 'type/slate'

import { generateNodeId } from './util'

const _jsx = jsx as <S extends 'element' | 'fragment' | 'text'>(
  tagName: S,
  attributes: S extends 'element' ? Omit<TNoneLeafNode, 'children'> : TObject,
  children: TNode[] | string,
) => ReturnType<
  {
    anchor: typeof createAnchor
    cursor: typeof createCursor
    editor: (tagName: string, attributes: TCommonNodeProps, children: TNode[]) => TSlateEditor
    element: typeof createElement
    focus: typeof createFocus
    fragment: typeof createFragment
    selection: typeof createSelection
    text: typeof createText
  }[S]
>

export function deserialize(element: HTMLElement, marks: Partial<TLeafNode<TMark>> = {}, isRoot = true): TValue {
  const node = <ChildNode>element
  const { childNodes, nodeName } = node
  const { attributes, className, id, nodeType, style: _style, textContent } = element
  const style = parseStyle(_style?.cssText ?? '') ?? {}
  const cssProps = Object.fromEntries(Object.entries(style).map(([key, value]) => [snakeToCamel(key), value]))
  const baseProps: Omit<TCommonNodeProps<Partial<TMark>>, 'previousType'> = {
    attributes: namedNodeMapToReactAttribute(attributes, 'contenteditable', 'style', 'class', 'id') as TCommonNodeProps<
      Partial<TMark>
    >['attributes'],
    className: className ?? '',
    id: id?.length ? id : generateNodeId(),
    placeholder: GET_TYPING_PLACEHOLDER(),
    style: {},
  }
  const _marks: Partial<TLeafNode<TMark>> = { ...marks }

  // define attributes for text nodes
  const trueMarks: [TNodeName, TTrueMark][] = [
    ['STRONG', 'bold'],
    ['CODE', 'code'],
    ['EM', 'italic'],
    ['KBD', 'kbd'],
    ['S', 'strikethrough'],
    ['SUB', 'subscript'],
    ['SUP', 'superscript'],
    ['U', 'underline'],
  ]
  const valueMarks = Object.entries(cssProps) as [TValueMark, string][]
  for (const [_nodeName, mark] of trueMarks) if (_nodeName === nodeName) _marks[mark] = true
  for (const [mark, value] of valueMarks) _marks[mark] = value

  if (!childNodes.length && isRoot)
    return [{ ...baseProps, children: [{ text: '' }], previousType: 'paragraph', type: 'paragraph' }]
  if (nodeType === Node.TEXT_NODE) return _jsx('text', marks, textContent?.trim() ?? '') as unknown as TValue

  const children = Array.from(node.childNodes)
    .map((node) => {
      const _element = <HTMLElement>node
      return deserialize(_element, _marks, false)
    })
    .flat() as TNode[]

  if (children.length === 0) children.push(_jsx('text', {}, ''))

  const makeElement = (type: TNodeType) =>
    _jsx('element', { ...baseProps, previousType: type as TBlockNodeType, type }, children) as unknown as TValue

  if (nodeName === 'BODY') return _jsx('fragment', {}, children) as TValue

  if (nodeName === 'BLOCKQUOTE') return makeElement('blockquote')
  if (nodeName === 'P') return makeElement('paragraph')
  if (nodeName === 'DIV') return makeElement('paragraph')
  if (nodeName === 'H1') return makeElement('heading-1')
  if (nodeName === 'H2') return makeElement('heading-2')
  if (nodeName === 'H3') return makeElement('heading-3')
  if (nodeName === 'H4') return makeElement('heading-4')
  if (nodeName === 'H5') return makeElement('heading-4')
  if (nodeName === 'H6') return makeElement('heading-4')

  return children as TValue
}
