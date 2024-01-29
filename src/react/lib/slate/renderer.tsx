import { BaseElement } from 'component/slate/block/BaseElement'
import type { RenderElementProps, RenderLeafProps } from 'slate-react'
import { TMark, TNodeType, TRenderElement } from 'type/slate'

import { MARKS, NODES } from './register'

export function renderElement({ attributes, children, element }: RenderElementProps) {
  attributes['data-slate-node'] = element.type as 'element'

  for (const [key, Component] of Object.entries(NODES) as [TNodeType, TRenderElement][]) {
    if (key === element.type)
      return (
        <Component
          attributes={attributes}
          element={element}
        >
          {children}
        </Component>
      )
  }

  return (
    <BaseElement
      attributes={attributes}
      element={element}
    >
      {children}
    </BaseElement>
  )
}

export function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
  for (const [key, Component] of Object.entries(MARKS) as [TMark, (props: RenderLeafProps) => JSX.Element][])
    if (Object.keys(leaf).includes(key))
      return (
        <Component
          attributes={attributes}
          leaf={leaf}
          text={leaf}
        >
          {children}
        </Component>
      )

  return <span {...attributes}>{children}</span>
}

export function typeToTag(type: TNodeType) {
  if (/heading-/.test(type)) return `h${type[type.length - 1]}` as `h${1 | 2 | 3 | 4 | 5 | 6}`
  // if (type === 'link') return 'a'
  // if (type === 'table') return 'table'
  // if (type === 'table-row') return 'tr'
  // if (type === 'table-cell') return 'td'
  return 'div'
}
