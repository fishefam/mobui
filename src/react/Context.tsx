import { createContext } from 'react'
import { useContext as useCtx } from 'react'
import { TProps } from 'type/common'
import { TContextProps } from 'type/context'

const Context = createContext<TContextProps>({})

export default function ContextProvider({ children }: TProps) {
  return <Context.Provider value={{}}>{children}</Context.Provider>
}

export function useContext() {
  return useCtx(Context)
}
