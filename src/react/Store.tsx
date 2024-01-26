import { createContext } from 'react'
import { useContext as useCtx } from 'react'
import { TProps } from 'type/common'
import { TContextProps } from 'type/context'

const Store = createContext<TContextProps>({})

export default function StoreProvider(props: TProps) {
  return (
    <Store.Provider
      {...props}
      value={{}}
    />
  )
}

export function useContext() {
  return useCtx(Store)
}
