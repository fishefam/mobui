import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { TSlatePlugin } from 'type/slate'

const PLUGINS: TSlatePlugin[] = []

export function createSlateEditor() {
  let baseEditor = createEditor()
  for (const plugin of PLUGINS) baseEditor = plugin(baseEditor)
  return withReact(withHistory(baseEditor))
}
