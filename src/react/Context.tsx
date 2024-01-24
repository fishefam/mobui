import { createContext } from 'react'
import { useContext as useCtx } from 'react'
import { TProps } from 'type/common'
import { TContextProps } from 'type/context'

const CONTEXT = createContext<TContextProps>({})

export default function Context({ children }: TProps) {
  return <CONTEXT.Provider value={{}}>{children}</CONTEXT.Provider>
}

export function useContext() {
  return useCtx(CONTEXT)
}
