import { CustomFlowbiteTheme, Sidebar as FlowbiteSidebar, theme as fbTheme } from 'flowbite-react'
import { cn } from 'lib/util'
import { PatchQuestionFill } from 'styled-icons/bootstrap'
import { Algo } from 'styled-icons/crypto'
import { Note, PersonFeedback } from 'styled-icons/fluentui-system-filled'

const THEME: CustomFlowbiteTheme['sidebar'] = {
  root: {
    collapsed: { off: 'h-full min-w-48' },
    inner: cn(
      fbTheme.sidebar.root.inner,
      'rounded-none border-r border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900',
    ),
  },
}

const ITEMS = [
  { icon: PatchQuestionFill, title: 'Question' },
  { icon: Note, title: 'Author Notes' },
  { icon: Algo, title: 'Algorithm' },
  { icon: PersonFeedback, title: 'Feedback' },
]

export default function Sidebar() {
  return (
    <FlowbiteSidebar theme={THEME}>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          {ITEMS.map(({ icon, title }) => (
            <FlowbiteSidebar.Item
              key={title}
              href="#"
              icon={icon}
            >
              {title}
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  )
}
