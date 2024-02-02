import { MathJax } from 'better-react-mathjax'
import { RefObject } from 'react'
import { useStore } from 'react/Store'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from 'shadcn/Table'

export default function AlgoPreview({ parent }: { parent: RefObject<HTMLDivElement> }) {
  const { algorithmPreview } = useStore()
  const [algoPreview] = algorithmPreview
  const algoVars = Object.keys(algoPreview)
  const algoProps = Object.values(algoPreview)

  return (
    <div
      className={'relative overflow-auto'}
      style={{ height: `${parent.current?.clientHeight}px` }}
    >
      <Table className="min-w-[30rem] table-fixed">
        <TableCaption className="sticky top-0 mt-0 caption-top bg-white py-4 dark:bg-black">
          Variable Preview
        </TableCaption>
        <TableHeader className="sticky top-[3.25rem] bg-accent">
          <TableRow>
            <TableHead>Variable</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {algoVars.map((algoVar, i) => (
            <TableRow key={algoVar}>
              <TableCell className="font-medium">{algoVar}</TableCell>
              <MathJax>
                <TableCell dangerouslySetInnerHTML={{ __html: algoProps[i].value }} />
              </MathJax>
              <TableCell>
                {algoProps[i].rangeStart && algoProps[i].rangeEnd
                  ? `[${algoProps[i].rangeStart} - ${algoProps[i].rangeEnd}]`
                  : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
