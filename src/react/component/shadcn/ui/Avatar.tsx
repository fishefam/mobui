import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from 'lib/util'
import { TProps } from 'type/common'

type TAvatarProps = { className: string } & TProps

export default function Avatar({ children, className }: TAvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    >
      {children}
    </AvatarPrimitive.Root>
  )
}

export function AvatarImage() {
  return <AvatarPrimitive.Image className={cn('aspect-square h-full w-full')} />
}

export function AvatarFallback({ children }: TProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('bg-muted flex h-full w-full items-center justify-center rounded-full text-xs')}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
}
