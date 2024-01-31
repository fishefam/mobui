import { TAlgoResponseValue, TLocalStorageKey, TPreviewDataKey, TSaveDataKey } from 'type/data'

import { getBaseURL } from './util'

type TPrepareSaveDataBodyProps = {
  algorithm: string
  authornotes: string
  feedback: string
  isPreview: boolean
  question: string
  questionName: string
}
type TSubmitDataProps<T extends TAlgoResponseValue | string> = {
  body: string
  isAlgorithm: boolean
  onError?: (value: T) => void
  onSuccess: (value: T) => void
  url: string
}

export function getSecurityToken() {
  return document.cookie.replace('AntiCsrfToken=', '')
}

export function getLocalStorage() {
  const keys: TLocalStorageKey[] = [
    'classId',
    'data',
    'extURL',
    'newInterface',
    'reponame',
    'uid',
    'uidHash',
    'username',
  ]
  const values = keys.map((key) => localStorage.getItem(key) as string)
  const entries = keys.map((key, i) => [key, values[i]])
  return Object.fromEntries(entries) as { [key in TLocalStorageKey]: string }
}

export function prepareSaveDataBody({
  algorithm,
  authornotes,
  feedback,
  isPreview,
  question,
  questionName,
}: TPrepareSaveDataBodyProps) {
  const { classId, uid } = getLocalStorage()
  const formData = new FormData()
  const data: [TSaveDataKey, string][] = [
    ['actionId', isPreview ? 'preview' : 'savedraft'],
    ['adaptive', 'false'],
    ['algorithm', algorithm],
    ['AntiCsrfToken', getSecurityToken()],
    ['authorNotes', authornotes],
    ['authorNotesEditor', authornotes],
    ['classId', classId],
    ['comment', feedback],
    ['commentEditor', feedback],
    ['editor', question],
    ['hasUnsavedQuestion', 'Unsaved changes to the current question will be lost.'],
    ['name', questionName],
    ['questionText', question],
    ['uid', uid],
  ]
  for (const [key, value] of data) formData.set(key, value)
  return new URLSearchParams(formData as unknown as URLSearchParams).toString()
}

export function preparePreviewDataBody(questionDefinition: string, version: string) {
  const formData = new FormData()
  const data: [TPreviewDataKey, string][] = [
    ['actionID', 'display'],
    ['algorithmic', 'false'],
    ['AntiCsrfToken', getSecurityToken()],
    ['baseUrl', getBaseURL()],
    ['error', 'false'],
    ['errorMsg', ''],
    ['questionDefinition', questionDefinition],
    ['slideNumber', ''],
    ['version', version],
  ] as const
  for (const [key, value] of data) formData.set(key, value)
  return new URLSearchParams(formData as unknown as URLSearchParams).toString()
}

export function submitData<T extends TAlgoResponseValue | string>({
  body,
  isAlgorithm,
  onError,
  onSuccess,
  url,
}: TSubmitDataProps<T>) {
  const headers = { 'Content-Type': isAlgorithm ? 'application/json' : 'application/x-www-form-urlencoded' }
  fetch(url, { body, headers, method: 'POST' })
    .then((response) => (isAlgorithm ? response.json() : response.text()))
    .then((value) => onSuccess(value as T))
    .catch((error) => (onError ? onError(error) : null))
}
