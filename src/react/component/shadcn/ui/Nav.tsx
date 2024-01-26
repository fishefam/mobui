import * as NavPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { cn } from 'lib/util'
import { ChevronDown } from 'lucide-react'
import { TProps } from 'type/common'

type TNavTriggerProps = { className?: string } & TProps

export const NavItem = NavPrimitive.Item
export const NavLink = NavPrimitive.Link
export const navTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
)

export default function Nav(props: TProps) {
  return (
    <NavPrimitive.Root
      {...props}
      className={cn('relative z-10 flex flex-1 items-center justify-between')}
    />
  )
}

export function NavList(props: TProps) {
  return (
    <NavPrimitive.List
      {...props}
      className={cn('group flex flex-1 list-none items-center justify-center space-x-1')}
    />
  )
}

export function NavTrigger(props: TNavTriggerProps) {
  return (
    <NavPrimitive.Trigger
      {...props}
      className={cn(navTriggerStyle(), 'group', props.className)}
    >
      {props.children}{' '}
      <ChevronDown
        aria-hidden="true"
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      />
    </NavPrimitive.Trigger>
  )
}

export function NavContent(props: TProps) {
  return (
    <NavPrimitive.Content
      {...props}
      className={cn('left-0 top-0 w-full md:absolute md:w-auto')}
    />
  )
}

export function NavViewport() {
  return (
    <div className={cn('absolute left-0 top-full flex justify-center')}>
      <NavPrimitive.Viewport
        className={cn(
          'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]',
        )}
      />
    </div>
  )
}

export function NavIndicator(props: TProps) {
  return (
    <NavPrimitive.Indicator
      {...props}
      className={cn(
        'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      )}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavPrimitive.Indicator>
  )
}
