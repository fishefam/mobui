import type { TState } from '@/type/slate'

import { checkSelection } from '../../util'

export function handleTabbable(state: TState) {
  checkSelection(state, () => {})
}
