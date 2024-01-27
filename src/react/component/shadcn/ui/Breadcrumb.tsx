import { getLocalStorageItem, toStartCase } from 'lib/util'
import { ChevronRightIcon, Edit2Icon } from 'lucide-react'
import { useStore } from 'react/Store'

export default function Breadcrumb() {
  const { questionName } = useStore()
  return (
    <ol className="inline-flex items-center space-x-1 !text-gray-500 md:space-x-2 rtl:space-x-reverse">
      <li className="inline-flex items-center">
        <a
          className="inline-flex cursor-default items-center text-sm font-medium hover:text-blue-600 dark:hover:text-white"
          href={`/${getLocalStorageItem('classId') !== '' ? getLocalStorageItem('classId') : '#'}`}
        >
          <svg
            className="me-2.5 h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="hidden md:inline">{toStartCase(getLocalStorageItem('reponame'))}</span>
        </a>
      </li>
      <li>
        <div className="flex items-center">
          <Chevron />
          <a
            className="ms-1 cursor-default text-sm font-medium hover:text-blue-600 dark:hover:text-white md:ms-2"
            href={`/${getLocalStorageItem('classId') !== '' ? getLocalStorageItem('classId') : '#'}/content`}
          >
            Repository
          </a>
        </div>
      </li>
      <li aria-current="page">
        <div className="flex items-center">
          <Chevron />
          <span className="ms-1 inline-flex items-center justify-between gap-3 whitespace-nowrap text-sm font-medium md:ms-2">
            <span className="relative">
              <input
                className="focus:text-accent-foreground block border-b-2 border-b-gray-200 bg-transparent py-2 ps-8 text-sm focus:border-b-blue-500 focus:outline-none"
                placeholder="Question Name"
                value={questionName[0]}
                onChange={({ target }) => questionName[1](target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2">
                <Edit2Icon className="h-4 w-4" />
              </div>
            </span>
          </span>
        </div>
      </li>
    </ol>
  )
}

function Chevron() {
  return (
    <ChevronRightIcon
      className="h-5 w-5 text-gray-400"
      strokeWidth={3}
    />
  )
}
