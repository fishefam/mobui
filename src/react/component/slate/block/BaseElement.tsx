import { typeToTag } from 'lib/slate/renderer'
import type { RenderElementProps } from 'slate-react'

export function BaseElement({ attributes, children, element }: RenderElementProps) {
  const { attributes: attrs, id, style, type } = element
  const Tag = typeToTag(type)

  return (
    <Tag
      {...attributes}
      {...attrs}
      id={id}
      style={style}
    >
      {children}
    </Tag>
  )
}
