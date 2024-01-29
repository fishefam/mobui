import { encode } from 'html-entities'
import toInlineStyle from 'style-object-to-css-string'
import { TBlockNode, TInlineNode, TNode, TText, TTrueMark, TValue, TVoidNode } from 'type/slate'

import { isLeafNode } from '.'
import { typeToTag } from './renderer'

export function serialize(value: TValue) {
  let html = ''
  for (const { attributes: attrs, children, id, style: _style, type } of value) {
    const tag = typeToTag(type)
    const attr = objectToString(attrs)
    const style = toInlineStyle(_style)
      .replace(/;(\s|\n)*/g, '; ')
      .trim()
    const childrenString = serializeChildren(children)
    html += `<${tag}${id.length ? ` id="${id}"` : ''}${attr.length ? ` ${attr}` : ''}${
      style.length ? ` style="${style}"` : ''
    }>${childrenString.length ? childrenString : '&nbsp;'}</${tag}>`
  }
  return html
}

function serializeChildren(children: TNode[]) {
  let html = ''
  for (const child of children) {
    if (!isLeafNode(child)) {
      const { attr, style, tag } = getHtmlInfo(child)
      const { id } = child
      html += `<${tag}${id.length ? ` id="${id}"` : ''}${attr.length ? ` ${attr}` : ''}${
        style.length ? ` style="${style}"` : ''
      }>${serializeChildren(child.children)}</${tag}>`
    }
    if (isLeafNode(child)) html += serializeLeafNode(child)
  }
  return html
}

function serializeLeafNode(child: TText) {
  const { text: _text, ...marks } = child
  const valueMarks = Object.fromEntries(Object.entries(marks).filter(([_, value]) => value !== true))
  const trueMarks = Object.entries(marks)
    .filter(([_, value]) => value === true)
    .map(([key]) => key as TTrueMark)
  const text = encode(_text).replace(/\t/g, '&#9;').replace(/\s/g, '&nbsp;')
  let html = `<span>${text}</span>`
  const style = toInlineStyle(valueMarks ?? {})
    .replace(/;(\s|\n)*/g, '; ')
    .trim()
  html = style.length ? html.replace(/^<span/, `<span style="${style}"`) : html
  for (const mark of trueMarks) {
    if (mark === 'bold') html = `<strong>${html}</strong>`
    if (mark === 'code') html = `<code>${html}</code>`
    if (mark === 'italic') html = `<em>${html}</em>`
    if (mark === 'kbd') html = `<kbd>${html}</kbd>`
    if (mark === 'strikethrough') html = `<s>${html}</s>`
    if (mark === 'subscript') html = `<sub>${html}</sub>`
    if (mark === 'superscript') html = `<sup>${html}</sup>`
    if (mark === 'underline') html = `<u>${html}</u>`
  }
  return html
}

function getHtmlInfo(child: TBlockNode | TInlineNode | TVoidNode) {
  const tag = typeToTag(child.type)
  const attr = objectToString(child.attrs)
  const style = toInlineStyle(child.style)
    .replace(/;(\s|\n)*/g, '; ')
    .trim()
  return { attr, style, tag }
}

function objectToString(object?: object) {
  return Object.entries(object ?? {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')
}
