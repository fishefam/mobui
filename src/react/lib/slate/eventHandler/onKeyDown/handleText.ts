import type { Path } from 'slate'

import type { TInlineVoidNode, TState } from '@/type/slate'

import { checkSelection, generateNodeId, retrieveLeafNode, retrieveNode } from '../../util'

export function handleTab_text(state: TState) {
  checkSelection(state, () => {
    const entry = retrieveNode(state, 'paragraph')
    if (entry) state.insertText('\t')
  })
}

export function handleDefault_text(state: TState, key: string) {
  checkSelection(state, () => {
    const entry = retrieveLeafNode(state)
    if (entry) {
      const [{ text }, path] = entry
      handleLatex(text + key, text, path, state)
    }
  })
}

function handleLatex(value: string, text: string, path: Path, state: TState) {
  const latexPattern = /\\\(.*\\\)/g
  const latex = value.match(latexPattern)
  if (latex) {
    const [string] = latex
    const newText = text.replace(string.slice(0, -1), '')
    state.insertText(newText, { at: path })
    const node: TInlineVoidNode = {
      attrs: {},
      children: [{ text: '' }],
      id: generateNodeId(),
      style: {},
      type: 'latex',
      voidData: { latex: string },
    }
    state.insertFragment([{ text: '' }, node])
  }
}
