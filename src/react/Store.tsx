import { getLocalStorageItem } from 'lib/util'
import { createContext, useContext, useState } from 'react'
import { TProps } from 'type/common'
import { TStore, TStoreProp } from 'type/store'

const PLACEHOLDER = () => {}
const INITIAL_STORE: TStore = {
  questionName: [JSON.parse(getLocalStorageItem('data')).name ?? 'Question Designer', PLACEHOLDER],
  section: ['question', PLACEHOLDER],
}

const Store = createContext<TStore>(INITIAL_STORE)

export default function StoreProvider(props: TProps) {
  const section = useState<TStoreProp<'section'>>(getInitialState('section'))
  const questionName = useState<TStoreProp<'questionName'>>(getInitialState('questionName'))
  return (
    <Store.Provider
      {...props}
      value={{ questionName, section }}
    />
  )
}

export function useStore() {
  return useContext(Store)
}

function getInitialState<T extends keyof TStore>(key: T): TStoreProp<T> {
  return INITIAL_STORE[key][0]
}
