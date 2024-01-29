import type { CSSProperties, ReactNode } from 'react'
import type { RenderLeafProps } from 'slate'
import { TMark, TTrueMark, TValueMark } from 'type/slate'

type TMarkRef = { Tag: keyof HTMLElementTagNameMap; className: string; mark: TTrueMark }

// style: {
//   backgroundColor: 'hsl(210 40% 96.1%)',
//   borderRadius: 'calc(0.5rem - 2px)',
//   fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
//   fontSize: '0.875rem',
//   lineHeight: '1.25rem',
//   padding: '0.2rem 0.3rem',
//   whiteSpace: 'pre-wrap',
// },
const trueMarks: TMarkRef[] = [
  { Tag: 'strong', className: '', mark: 'bold' },
  { Tag: 'i', className: '', mark: 'italic' },
  { Tag: 'u', className: '', mark: 'underline' },
  { Tag: 's', className: '', mark: 'strikethrough' },
  { Tag: 'sub', className: '', mark: 'subscript' },
  { Tag: 'kbd', className: '', mark: 'kbd' },
  { Tag: 'sup', className: '', mark: 'superscript' },
  { Tag: 'code', className: '', mark: 'code' },
]

export function TrueMarkLeaf({ attributes, children, leaf }: RenderLeafProps<TMark>) {
  const entries = Object.entries(leaf) as [TTrueMark | TValueMark, string | true][]
  const marks = entries.filter(([_, value]) => typeof value === 'boolean' && value).map(([mark]) => mark as TTrueMark)
  return wrapTrueMark({ attributes, children, markRefs: trueMarks, marks })
}

export function ValueMarkLeaf({ attributes, children, leaf }: RenderLeafProps<TMark>) {
  const { text: _, ...rest } = leaf
  const entries = Object.entries(rest) as [TTrueMark | TValueMark, string | true][]
  const valueMarkEntries = entries.filter(([_, value]) => typeof value === 'string') as [TValueMark, string][]
  const marks = Object.fromEntries(valueMarkEntries) as { [key in TValueMark]: string }
  return wrapValueMark({ attributes, children, marks })
}

function wrapTrueMark({
  attributes,
  children,
  markRefs,
  marks,
}: {
  attributes: RenderLeafProps['attributes']
  children: ReactNode
  markRefs: TMarkRef[]
  marks: TTrueMark[]
}) {
  let Element = <>{children}</>
  markRefs.forEach(({ Tag, className, mark }) => {
    if (marks.includes(mark))
      Element = (
        <Tag
          {...attributes}
          className={className}
        >
          {Element}
        </Tag>
      )
  })
  return Element
}

function wrapValueMark({
  attributes,
  children,
  marks,
}: {
  attributes: RenderLeafProps['attributes']
  children: ReactNode
  marks: { [key in TValueMark]: string }
}) {
  return (
    <span
      {...attributes}
      style={{ ...(marks as CSSProperties) }}
    >
      {children}
    </span>
  )
}
