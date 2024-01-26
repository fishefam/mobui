import { cn } from 'lib/util'
import { useState } from 'react'
import Avatar, { AvatarFallback } from 'shadcn/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shadcn/Dropdown'
import Nav, { NavContent, NavItem, NavLink, NavList, NavTrigger, NavViewport } from 'shadcn/Nav'
import { TSetState } from 'type/common'

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

const CLASS_ID = localStorage.getItem('classId') ?? ''
const USER_NAME = (localStorage.getItem('username') ?? '').replace(/\(.*$/, '')
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
    trigger: 'User Manager',
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
  { href: 'content', subitems: [], trigger: 'Content Repository' },
].map((item) => ({
  ...item,
  href: item.href ? createHref(CLASS_ID, item.href) : '',
  subitems: item.subitems.map(({ href, title }) => ({
    href: createHref(CLASS_ID !== '' ? CLASS_ID : '#', href),
    title,
  })),
}))

export default function Navbar() {
  const [selection, setSelection] = useState('')
  return (
    <Nav delayDuration={0}>
      <Logo />
      <NavList>
        {ITEMS.map(({ href, subitems, trigger }) => {
          if (href)
            return (
              <LinkItem
                key={trigger}
                {...{ href, trigger }}
              />
            )
          return (
            <MenuItem
              key={trigger}
              {...{ selection, setSelection, subitems, trigger }}
            />
          )
        })}
        <Profile />
      </NavList>
    </Nav>
  )
}

function Profile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{USER_INITIALS !== '' ? USER_INITIALS : 'MN'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{USER_NAME !== '' ? USER_NAME : 'Truong Nguyen'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="https://www.digitaled.com/products/courseware/support.aspx">Help</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/users/privacypolicy">Terms of service</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#">Close</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  return (
    <NavLink asChild>
      <a
        href={href}
        className={cn(
          'hover:bg-accent focus:bg-accent focus:text-accent-foreground hover:text-accent-foreground block cursor-default select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none',
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
      </a>
    </NavLink>
  )
}

function Logo() {
  return (
    <svg
      className="h-10"
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

function createHref(classId: string, path: string) {
  return `/${classId}/${path}`
}
