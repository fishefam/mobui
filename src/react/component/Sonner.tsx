import { useStore } from 'react/Store'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export default function Toaster({ ...props }: ToasterProps) {
  const { theme } = useStore()
  const [_theme] = theme

  return (
    <div className="fixed bottom-3 right-3">
      <Sonner
        className="toast group"
        theme={_theme}
        toastOptions={{
          classNames: {
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
            description: 'group-[.toast]:text-muted-foreground',
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          },
        }}
        {...props}
      />
    </div>
  )
}
