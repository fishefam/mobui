import { Image, Link, LucideIcon, Minus, Pi, Smile } from 'lucide-react'
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from 'shadcn/Menubar'

const ITEMS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Image, label: 'Image' },
  { Icon: Link, label: 'Link' },
  { Icon: Minus, label: 'Horizontal Line' },
  { Icon: Smile, label: 'Emoji' },
  { Icon: Pi, label: 'Equation' },
]

export default function InsertMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>Insert</MenubarTrigger>
      <MenubarContent>
        {ITEMS.map(({ Icon, label }) => (
          <MenubarItem key={label}>
            <div className="flex items-start gap-3">
              <Icon className="mt-[0.35rem] h-3 w-3" />
              {label}
            </div>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  )
}
