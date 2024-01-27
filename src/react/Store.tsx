import { createContext, useContext, useState } from 'react'
import { TProps } from 'type/common'
import { TStore } from 'type/store'

const INITIAL_STORE: TStore = { section: ['question', () => {}] }

const Store = createContext<TStore>(INITIAL_STORE)

export default function StoreProvider(props: TProps) {
  const section = useState<TStore['section'][0]>('question')

  return (
    <Store.Provider
      {...props}
      value={{ section }}
    />
  )
}

export function useStore() {
  return useContext(Store)
}
