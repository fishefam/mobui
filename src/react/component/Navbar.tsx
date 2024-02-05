import { getLocalStorage, setLocalStorage } from 'lib/data'
import { cn } from 'lib/util'
import { Fragment, MouseEvent, RefObject, useState } from 'react'
import { BREAK_POINT } from 'react/constant'
import { useWindowSize } from 'react/hook'
import { useStore } from 'react/Store'
import Avatar, { AvatarFallback } from 'shadcn/Avatar'
import { Button } from 'shadcn/Button'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from 'shadcn/Dropdown'
import { Label } from 'shadcn/Label'
import Nav, { NavContent, NavItem, NavLink, NavList, NavTrigger, NavViewport } from 'shadcn/Nav'
import { Sheet, SheetContent, SheetTrigger } from 'shadcn/Sheet'
import { Switch } from 'shadcn/Switch'
import { Tabs, TabsTrigger } from 'shadcn/Tabs'
import { TabsList } from 'shadcn/Tabs'
import { TSetState } from 'type/common'
import { TStoreProp } from 'type/store'

import ExitWarning from './ExitWarning'

type TItems = {
  href: string
  subitems: { href: string; title: string }[]
  trigger: string
}[]
type TListItemProps = { [key in 'href' | 'title']: string }
type TLinkItemProps = { href: string; trigger: string }
type TMenuItemProps = {
  selection: string
  setSelection: TSetState<string>
  subitems: TItems[0]['subitems']
  trigger: string
}

const CLASS_ID = getLocalStorage().classId
const USER_NAME = getLocalStorage().username.replace(/\(.*$/, '')
const USER_INITIALS = USER_NAME.split(' ')
  .filter((_, i, { length }) => i === 0 || i === length - 1)
  .map((val) => val.charAt(0))
  .join('')
const ITEMS: TItems = [
  {
    href: '',
    subitems: [
      { href: 'users', title: 'Search for Users' },
      { href: 'users/active', title: 'Show Active Users' },
      { href: 'users/import', title: 'Import Users From Roster' },
      { href: 'users/bulkremove', title: 'Remove Users Using Roster' },
      { href: 'users/add', title: 'Enroll Users' },
      { href: 'users/remove', title: 'Remove Users' },
    ],
    trigger: 'User Management',
  },
  {
    href: '',
    subitems: [
      { href: 'gradebook', title: 'Class Grades' },
      { href: 'gradebook/statistics', title: 'Item Statistics' },
      { href: 'gradebook/reports', title: 'Grade Reports' },
      { href: 'gradebook/rubrics', title: 'Rubric Tables' },
      { href: 'gradebook/regradejobs', title: 'Regrade Jobs' },
    ],
    trigger: 'Gradebook',
  },
  {
    href: '',
    subitems: [
      { href: 'gradebook/external', title: 'External & Rubrics' },
      { href: 'gradebook/external/new', title: 'External Import' },
      { href: 'gradebook/scanneddocuments', title: 'Document Upload' },
    ],
    trigger: 'External',
  },
  { href: 'proctortools', subitems: [], trigger: 'Proctor' },
  { href: 'content', subitems: [], trigger: 'Repository' },
].map((item) => ({
  ...item,
  href: item.href ? createHref(CLASS_ID !== '' ? CLASS_ID : '#', item.href) : '',
  subitems: item.subitems.map(({ href, title }) => ({
    href: createHref(CLASS_ID !== '' ? CLASS_ID : '#', href),
    title,
  })),
}))

export default function Navbar({ container }: { container: RefObject<HTMLDivElement> }) {
  const { theme } = useStore()
  const { width } = useWindowSize()

  const [_theme] = theme

  return (
    <Nav delayDuration={0}>
      <div className="flex items-center gap-4">
        <NavMobile />
        <Logo />
      </div>
      <NavList>
        {width > BREAK_POINT.lg ? <NavListItem /> : null}
        {width > BREAK_POINT.md ? <ViewChange /> : null}
        <Profile root={container} />
      </NavList>
    </Nav>
  )
}

function NavMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="block lg:hidden"
          variant="ghost"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-auto"
        side="left"
      >
        {ITEMS.map(({ href, subitems, trigger }) => (
          <Fragment key={trigger}>
            {
              <h4 className="mb-4 font-medium">
                {href ? (
                  <a
                    className="text-muted-foreground"
                    href={href}
                  >
                    {trigger}
                  </a>
                ) : (
                  trigger
                )}
              </h4>
            }
            {subitems.map(({ href, title }) => (
              <a
                key={title}
                className="my-4 ml-4 block text-muted-foreground"
                href={href}
              >
                {title}
              </a>
            ))}
          </Fragment>
        ))}
      </SheetContent>
    </Sheet>
  )
}

function NavListItem() {
  const [selection, setSelection] = useState('')
  return ITEMS.map(({ href, subitems, trigger }) => {
    if (href)
      return (
        <LinkItem
          key={trigger}
          href={href}
          trigger={trigger}
        />
      )
    return (
      <MenuItem
        key={trigger}
        selection={selection}
        setSelection={setSelection}
        subitems={subitems}
        trigger={trigger}
      />
    )
  })
}

function ViewChange() {
  const { panelLayout } = useStore()
  const [_panelLayout, _setPanelLayout] = panelLayout

  const layouts: TStoreProp<'panelLayout'>[] = ['left', 'top', 'right']

  return (
    <Dropdown>
      <DropdownTrigger
        asChild
        className="!mr-4"
      >
        <Button variant="outline">
          <LayoutPanelIcon
            className={`h-4 w-4 ${_panelLayout === 'left' ? '-rotate-90' : _panelLayout === 'right' ? 'rotate-90' : ''}`}
          />
        </Button>
      </DropdownTrigger>
      <DropdownContent className="w-56">
        <DropdownLabel>View</DropdownLabel>
        <DropdownSeparator />
        <Tabs className="w-full">
          <TabsList className="w-full justify-evenly gap-1 bg-transparent">
            {layouts.map((layout) => (
              <TabsTrigger
                key={layout}
                className={cn('h-full w-full py-2 hover:bg-accent', _panelLayout === layout && 'bg-accent')}
                value={layout}
                onClick={() => {
                  setLocalStorage(['panelLayout', layout])
                  _setPanelLayout(layout)
                }}
              >
                <LayoutPanelIcon className={layout === 'left' ? '-rotate-90' : layout === 'right' ? 'rotate-90' : ''} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </DropdownContent>
    </Dropdown>
  )
}

function Profile({ root }: { root: RefObject<HTMLDivElement> }) {
  const { isUnsaved, theme: _theme } = useStore()
  const [showWarningEditDialog, setShowWarningExitDialog] = useState(false)

  const [theme, setTheme] = _theme

  const [_isUnsaved, _setIsUnsaved] = isUnsaved

  return (
    <>
      <Dropdown
        onOpenChange={(open) => {
          if (!open) root.current?.classList.remove('!z-0')
          if (open) root.current?.classList.add('!z-0')
        }}
      >
        <DropdownTrigger className="rounded-full focus:ring-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{USER_INITIALS !== '' ? USER_INITIALS : 'TN'}</AvatarFallback>
          </Avatar>
        </DropdownTrigger>
        <DropdownContent className="min-w-52">
          <DropdownLabel>{USER_NAME !== '' ? USER_NAME : 'Truong Nguyen'}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem
            asChild
            onClick={(event) => {
              event.preventDefault()
              setTheme((state) => (state === 'dark' ? 'light' : 'dark'))
              localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark')
            }}
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={theme === 'dark'}
                className="dark:bg-[hsl(214.3 31.8% 91.4%)] shadow"
                id="theme-switch"
              />
              <Label htmlFor="theme-switch">{`${theme === 'dark' ? 'Dark' : 'Light'} Mode`}</Label>
            </div>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem asChild>
            <a
              href="#"
              onClick={loadDefaultInterface}
            >
              Default UI
            </a>
          </DropdownItem>
          <DropdownItem asChild>
            <a href="https://www.digitaled.com/products/courseware/support.aspx">Support Page</a>
          </DropdownItem>
          <DropdownItem asChild>
            <a href="/users/privacypolicy">Terms of Service</a>
          </DropdownItem>
          <DropdownItem onClick={() => (_isUnsaved ? setShowWarningExitDialog(true) : history.back())}>
            Exit
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
      <ExitWarning
        setShow={setShowWarningExitDialog}
        show={showWarningEditDialog}
      />
    </>
  )
}

function LinkItem({ href, trigger }: TLinkItemProps) {
  return (
    <Link
      key={trigger}
      href={href}
      title={trigger}
    />
  )
}

function MenuItem({ selection, setSelection, subitems, trigger }: TMenuItemProps) {
  return (
    <NavItem
      key={trigger}
      className="relative"
    >
      <NavTrigger
        className="cursor-default"
        onMouseOver={() => setSelection(trigger)}
      >
        {trigger}
      </NavTrigger>
      <NavContent>
        <ul className="w-64 p-3">
          {subitems.map(({ href, title }) => (
            <li key={title}>
              <Link
                href={href}
                title={title}
              />
            </li>
          ))}
        </ul>
      </NavContent>
      {selection === trigger ? <NavViewport /> : null}
    </NavItem>
  )
}

function Link({ href, title }: TListItemProps) {
  const { isUnsaved } = useStore()

  const [_isUnsaved] = isUnsaved
  return (
    <>
      <NavLink asChild>
        <a
          href={href}
          className={cn(
            'block cursor-default select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavLink>
    </>
  )
}

function Logo() {
  const {
    theme: [theme],
  } = useStore()

  return (
    <svg
      className={cn('h-7 md:h-10', theme === 'dark' ? 'text-yellow-500' : 'text-violet-500')}
      fill="currentColor"
      viewBox="0 0 153 67"
    >
      <g transform="translate(0 67) scale(.05 -.05)">
        <path d="m1380 870v-191l-100-128c-186-236-460-182-411 80 34 180 292 207 363 37 32-77 68-74 68 5 0 67-102 162-192 179-279 52-427-327-190-486 146-98 272-51 423 158 165 230 194 256 288 256 102 0 161-40 190-128 79-239-272-370-361-135-23 58-70 45-63-18 26-217 390-235 478-24 103 245-185 505-372 336-55-50-61-39-61 109 0 111-6 140-30 140-25 0-30-34-30-190z" />
        <path d="m924 995c4-30 20-45 46-45s42 15 46 45c6 37-3 45-46 45s-52-8-46-45z" />
        <path d="m1100 990c0-54 67-73 85-25 15 41-6 75-47 75-27 0-38-14-38-50z" />
        <path d="m1983 997c5-31 20-47 47-47 60 0 54 78-7 87-38 5-45-2-40-40z" />
        <path d="m126 831c-27-20-48-24-56-11-52 84-71 14-66-235 5-211 11-255 36-255 24 0 32 41 40 206 11 225 21 243 134 244 100 0 126-55 126-274 0-152 5-186 30-186 35 0 36 6 30 186-6 216 53 300 187 267 66-17 96-100 93-262-4-192-4-191 30-191 35 0 35 0 30 220-6 282-144 407-308 278-50-40-56-40-90-9-54 48-163 60-216 22z" />
        <path d="m1992 829c-41-107-9-509 41-509 36 0 31 522-6 534-12 4-28-7-35-25z" />
        <path d="m2154 847c-26-25-15-327 14-396 50-118 227-171 330-98 44 31 48 31 66 0 39-71 56-1 56 235 0 249-8 287-50 252-16-13-21-70-15-175 12-200-29-265-163-265-150 0-200 87-188 328 6 109-14 155-50 119z" />
        <path d="m2755 820c-120-94-62-216 123-257 115-26 154-64 123-121-32-59-171-65-249-11-86 61-104-3-19-70 127-99 327-26 327 120 0 87-27 110-178 148-95 24-136 66-116 118 17 44 179 46 214 3 31-37 80-39 80-3 0 95-213 146-305 73z" />
      </g>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 5H11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
      <path
        d="M3 12H16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
      <path
        d="M3 19H21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
    </svg>
  )
}

function LayoutPanelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-4 dark:text-white', className)}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M0 9.002C0 8.45.455 8 .992 8h18.016c.548 0 .992.456.992 1.002v9.996c0 .553-.455 1.002-.992 1.002H.992C.444 20 0 19.544 0 18.998V9.002Zm0-8C0 .45.451 0 .99 0h4.02A.99.99 0 0 1 6 1.003v4.994C6 6.551 5.549 7 5.01 7H.99A.99.99 0 0 1 0 5.997V1.003Zm7 0C7 .45 7.451 0 7.99 0h4.02A.99.99 0 0 1 13 1.003v4.994C13 6.551 12.549 7 12.01 7H7.99A.99.99 0 0 1 7 5.997V1.003Zm7 0C14 .45 14.451 0 14.99 0h4.02A.99.99 0 0 1 20 1.003v4.994C20 6.551 19.549 7 19.01 7h-4.02A.99.99 0 0 1 14 5.997V1.003Z"></path>
    </svg>
  )
}

function createHref(classId: string, path: string) {
  return `/${classId}/${path}`
}

function loadDefaultInterface(event: MouseEvent) {
  event.preventDefault()
  localStorage.setItem('newInterface', 'off')
  const { href } = location
  location.href = href
}
