import type { TState } from '@/type/slate'

import { withDeleteForward } from './withDeleteBackward'
import { withDeleteBackward } from './withDeleteForward'
import { withHardBreak } from './withHardBreak'
import { withInsertInsideTable } from './withInsertInsideTable'

export function withTable(state: TState) {
  withDeleteBackward(state)
  withDeleteForward(state)
  withInsertInsideTable(state)
  withHardBreak(state)
  return state
}
