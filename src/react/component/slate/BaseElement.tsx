import { typeToTag } from 'lib/slate/renderer'
import { cn } from 'lib/util'
import { type RenderElementProps } from 'slate-react'

export function BaseElement({ attributes, children, element }: RenderElementProps) {
  const { attributes: attrs, className, id, placeholder, style, type } = element
  const Tag = typeToTag(type)
  const elementStyle = { ...style, ...getHeadingTagStyle(Tag) }

  return (
    <Tag
      {...attributes}
      {...attrs}
      aria-placeholder={placeholder}
      className={cn(className)}
      id={id}
      style={elementStyle}
    >
      {children}
    </Tag>
  )
}

function getHeadingTagStyle(tag: ReturnType<typeof typeToTag>) {
  if (tag === 'h1')
    return {
      fontSize: '2.25rem',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: '2.5rem',
    }
  if (tag === 'h2')
    return {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: '2.25rem',
    }
  if (tag === 'h3')
    return {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: '2rem',
    }
  if (tag === 'h4')
    return {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: '1.75rem',
    }
  if (tag === 'blockquote')
    return { borderLeftWidth: '2px', fontStyle: 'italic', marginTop: '1.5rem', paddingLeft: '1.5rem' }
  return {}
}
