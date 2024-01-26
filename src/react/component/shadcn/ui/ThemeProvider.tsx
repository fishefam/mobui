import { createContext, SetStateAction, useContext, useEffect, useState } from 'react'
import { TProps, TSetState } from 'type/common'

type TTheme = 'dark' | 'light'
type TState = { setTheme: TSetState<TTheme>; theme: TTheme }

const SYSTEM_THEME: TTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'
const INITIAL_STATE: TState = {
  setTheme: (_: SetStateAction<TTheme>) => {},
  theme: SYSTEM_THEME,
}

const Context = createContext(INITIAL_STATE)

export default function ThemeProvider({ children }: TProps) {
  const { setTheme, theme } = useThemeChange()
  return <Context.Provider value={{ setTheme, theme }}>{children}</Context.Provider>
}

export function useTheme() {
  return useContext(Context)
}

function useThemeChange() {
  const [theme, setTheme] = useState<TTheme>('light')
  useEffect(() => {
    const html = document.querySelector('html')!
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
    html.style.colorScheme = theme
  }, [theme])
  return { setTheme, theme }
}
