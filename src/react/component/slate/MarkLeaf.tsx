import { type CSSProperties, Fragment, type ReactNode } from 'react'
import type { RenderLeafProps } from 'slate'
import { TMark, TTrueMark, TValueMark } from 'type/slate'

type TMarkRef = { Tag: keyof HTMLElementTagNameMap; className: string; mark: TTrueMark }

const TRUE_MARK: TMarkRef[] = [
  { Tag: 'strong', className: '', mark: 'bold' },
  { Tag: 'i', className: '', mark: 'italic' },
  { Tag: 'u', className: '', mark: 'underline' },
  { Tag: 's', className: '', mark: 'strikethrough' },
  { Tag: 'sub', className: '', mark: 'subscript' },
  { Tag: 'kbd', className: '', mark: 'kbd' },
  { Tag: 'sup', className: '', mark: 'superscript' },
  { Tag: 'code', className: '', mark: 'code' },
]

export function MarkLeaf({ attributes, children, leaf }: RenderLeafProps<TMark>) {
  const entries = Object.entries(leaf) as ['text' | TMark, string | true][]
  const trueMarkKeys = entries.filter(([_, value]) => value === true).map(([key]) => key) as TTrueMark[]
  const valueMark = Object.fromEntries(
    entries.filter(([key, value]) => key !== 'text' && value !== true),
  ) as CSSProperties
  return wrapMark({ attributes, children, trueMarkKeys, trueMarkRefs: TRUE_MARK, valueMark })
}

function wrapMark({
  attributes,
  children,
  trueMarkKeys,
  trueMarkRefs,
  valueMark,
}: {
  attributes: RenderLeafProps['attributes']
  children: ReactNode
  trueMarkKeys: TTrueMark[]
  trueMarkRefs: TMarkRef[]
  valueMark: CSSProperties
}) {
  let Element = <>{children}</>
  const style = getStyle([...trueMarkKeys, ...(Object.keys(valueMark) as TValueMark[])])
  trueMarkRefs.forEach(({ Tag, className, mark }) => {
    if (trueMarkKeys.includes(mark))
      Element = (
        <Tag
          {...attributes}
          className={className}
          style={style}
        >
          {Element}
        </Tag>
      )
  })
  return (
    <span
      {...attributes}
      style={valueMark}
    >
      {Element}
    </span>
  )
}

function getStyle(marks: TMark[]) {
  let result: CSSProperties = {}
  for (const mark of marks) {
    if (mark === 'code')
      result = {
        ...result,
        backgroundColor: 'hsl(210 40% 96.1%)',
        borderRadius: '0.375rem',
        fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        padding: '0.2rem 0.3rem',
        whiteSpace: 'pre-wrap',
      }
  }
  return result
}
