import { ReactEditor } from 'lib/slate'
import { Check, Eye, Fullscreen, Pencil } from 'lucide-react'
import { RefObject } from 'react'
import { useStore } from 'react/Store'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from 'shadcn/Menubar'
import { useSlateStatic } from 'slate-react'
import { TSlateEditor } from 'type/slate'

type TViewMenuProps = { containerRef: RefObject<HTMLElement> }

export default function ViewMenu({ containerRef }: TViewMenuProps) {
  const editor = useSlateStatic()
  const store = useStore()
  const { section } = store
  const [currentSection] = section

  const [isEditorReadOnly, setIsEditorReadOnly] =
    currentSection !== 'algorithm' ? store[`${currentSection}SlateReadOnly`] : [true, () => {}]
  const ModeIcon = isEditorReadOnly ? Eye : Pencil

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>
            <div className="flex items-start gap-3">
              <ModeIcon className="mt-[0.35rem] h-3 w-3" />
              Mode
            </div>
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem onClick={() => setIsEditorReadOnly(false)}>
              <div className="flex min-w-48 items-start justify-start gap-3">
                <Pencil className="mt-[0.35rem] h-3 w-3" />
                <div>
                  <h4 className="text-sm font-semibold">Editing</h4>
                  <p className="text-xs">Edit document directly</p>
                </div>
                {!isEditorReadOnly ? <Check className="h-5 w-5 self-center" /> : null}
              </div>
            </MenubarItem>
            <MenubarItem onClick={() => setIsEditorReadOnly(true)}>
              <div className="flex min-w-48 items-start justify-start gap-3">
                <Eye className="mt-[0.35rem] h-3 w-3" />
                <div>
                  <h4 className="text-sm font-semibold">Viewing</h4>
                  <p className="text-xs">Read or print final document</p>
                </div>
                {isEditorReadOnly ? <Check className="h-5 w-5 self-center" /> : null}
              </div>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem onClick={() => handleFullscreen(editor, containerRef)}>
          <div className="flex items-start gap-3">
            <Fullscreen className="mt-[0.35rem] h-3 w-3" />
            Toggle Fullscreen
          </div>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function handleFullscreen(editor: TSlateEditor, containerRef: RefObject<HTMLElement>) {
  let isAlreadySet = false
  const classNames = ['!fixed', 'z-10', 'h-screen', 'bg-white', 'dark:bg-accent', 'w-screen', 'top-0', 'left-0']
  const element = containerRef.current
  if (!isAlreadySet && !element?.classList.contains('!fixed')) {
    element?.classList.add(...classNames)
    isAlreadySet = true
  }
  if (!isAlreadySet && element?.classList.contains('!fixed')) element.classList.remove(...classNames)
  ReactEditor.focus(editor)
}
