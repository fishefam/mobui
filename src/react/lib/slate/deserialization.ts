import type { TBlockNodeType, TLeafNode, TMark, TNode, TNodeType, TText, TValue } from '@/type/slate'
import type { Token } from 'slate-hyperscript/dist/tokens'

import { isLeafNode } from '@/type/slate'
import { jsx as _jsx } from 'slate-hyperscript'

import { getAttributes } from '../dom'
import { generateNodeId } from './util'

const jsx = _jsx as <T extends 'element' | 'fragment' | 'text'>(
  tagName: T,
  attributes?: T extends 'fragment'
    ? Record<string, never>
    : T extends 'element'
      ? Omit<TNode, 'children'>
      : Omit<TLeafNode, 'text'>,
  ...children: unknown[]
) => ReturnType<typeof _jsx>

export function deserialize(
  node: ChildNode,
  marks: { [key in TMark]?: boolean | string } = {},
): null | ReturnType<typeof jsx> | Token | TValue {
  const { attributes: attrs, childNodes, id, nodeName, nodeType, textContent } = node as HTMLElement

  console.log(nodeType)
  if (nodeType === Node.TEXT_NODE) return jsx('text', marks, textContent?.replace(/^\n|\n$/g, '').trim())
  if (nodeType !== Node.ELEMENT_NODE) return null

  const attributes = { ...marks }

  // define attributes for text nodes
  if (nodeName === 'STRONG') attributes.bold = true
  if (nodeName === 'U') attributes.underline = true
  if (nodeName === 'S') attributes.strikethrough = true
  if (nodeName === 'EM') attributes.italic = true
  if (nodeName === 'SUB') attributes.subscript = true
  if (nodeName === 'SUP') attributes.superscript = true

  const children = Array.from(childNodes)
    .map((node) => deserialize(node, attributes))
    .flat()

  if (children.length === 0)
    children.push({ children: [jsx('text', attributes, '')], id: generateNodeId(), type: 'paragraph' })
  if (children.length === 1 && isLeafNode(children[0] as TText)) {
    const props = children[0] as TText
    children[0] = { children: [props], id: generateNodeId(), type: 'paragraph' }
  }

  if (nodeName === 'BODY') return jsx('fragment', {}, children)
  if (nodeName === 'BLOCKQUOTE') return createBaseNode({ attributes: attrs, children, id, type: 'blockquote' })
  if (isParagraphNode(nodeName)) return createBaseNode({ attributes: attrs, children, id, type: 'paragraph' })
  if (isHeadingNode(nodeName))
    return createBaseNode({ attributes: attrs, children, id, type: nodeName.toLowerCase() as TBlockNodeType })
  if (nodeName === 'A') return createBaseNode({ attributes: attrs, children, id, type: 'link' })
  return children
}

function isParagraphNode(nodeName: string) {
  const paragraphTags = ['address', 'article', 'aside', 'div', 'header', 'main', 'nav', 'p', 'pre', 'section']
  return paragraphTags.includes(nodeName.toLowerCase())
}

function isHeadingNode(nodeName: string) {
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  return headingTags.includes(nodeName.toLowerCase())
}

function createBaseNode({
  attributes,
  children,
  id,
  type,
}: {
  attributes: NamedNodeMap
  children: unknown
  id: string
  type: TNodeType
}) {
  return jsx(
    'element',
    { attributes: getAttributes(attributes)?.attrs, id: id.length ? id : generateNodeId(), type },
    children,
  )
}
