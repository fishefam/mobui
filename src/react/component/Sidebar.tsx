import { cn } from 'lib/util'
import { AlbumIcon, Code2Icon, HelpCircleIcon, InfoIcon, LucideIcon } from 'lucide-react'
import { MouseEvent } from 'react'
import { useStore } from 'react/Store'
import { TStoreProp } from 'type/store'

type TItems = { Icon: LucideIcon; label: string; section: TStoreProp<'section', 'state'> }[]

const ITEMS: TItems = [
  { Icon: HelpCircleIcon, label: 'Question', section: 'question' },
  { Icon: InfoIcon, label: 'Author Notes', section: 'authornotes' },
  { Icon: Code2Icon, label: 'Algorithm', section: 'algorithm' },
  { Icon: AlbumIcon, label: 'Feedback', section: 'feedback' },
]

export default function Sidebar() {
  const { section } = useStore()
  const [currentSection, setSection] = section

  return (
    <ul className="space-y-2 text-sm">
      {ITEMS.map(({ Icon, label, section }) => (
        <li key={section}>
          <a
            className={cn(
              'group flex cursor-default items-center rounded-lg p-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              section === currentSection ? 'bg-accent text-accent-foreground' : '',
            )}
            onClick={(event) => selectSection(event, section, setSection)}
          >
            <Icon
              className={cn(
                'h-5 w-5 text-gray-500 transition duration-75 dark:group-hover:text-white group-hover:dark:text-gray-400',
                section === currentSection
                  ? 'text-accent-foreground dark:group-hover:text-accent-foreground group-hover:dark:text-accent-foreground'
                  : '',
              )}
            />
            <span className="ms-3">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function selectSection(
  event: MouseEvent,
  section: TStoreProp<'section', 'state'>,
  setSection: TStoreProp<'section', 'setstate'>,
) {
  event.preventDefault()
  setSection(section)
}
