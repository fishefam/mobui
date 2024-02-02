import { TLanguage } from 'type/common'
import { TAlgoResponseValue, TLocalStorageKey, TNormalizedSection, TPreviewDataKey, TSaveDataKey } from 'type/data'

import { extractHTML, getBaseURL } from './util'

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
    'panelLayout',
    'previewFormContainerId',
    'reactRootId',
    'reponame',
    'rootLoaderId',
    'scriptContainerId',
    'theme',
    'uid',
    'uidHash',
    'username',
  ]
  const values = keys.map((key) => localStorage.getItem(key) as string)
  const entries = keys.map((key, i) => [key, values[i]])
  return Object.fromEntries(entries) as { [key in TLocalStorageKey]: string }
}

export function getData<T extends TNormalizedSection>(section: T, type: T extends 'algorithm' ? undefined : TLanguage) {
  const { data } = getLocalStorage()
  const { algorithm, authorNotesEditor, commentEditor, editor } = JSON.parse(data) as { [key in TSaveDataKey]?: string }
  if (section === 'algorithm') return algorithm ?? ''
  if (section === 'authornotes' && type === 'HTML') return extractHTML(authorNotesEditor ?? '', 'HTML')
  if (section === 'authornotes' && type === 'CSS') return extractHTML(authorNotesEditor ?? '', 'CSS')
  if (section === 'authornotes' && type === 'JS') return extractHTML(authorNotesEditor ?? '', 'JS')
  if (section === 'feedback' && type === 'HTML') return extractHTML(commentEditor ?? '', 'HTML')
  if (section === 'feedback' && type === 'CSS') return extractHTML(commentEditor ?? '', 'CSS')
  if (section === 'feedback' && type === 'JS') return extractHTML(commentEditor ?? '', 'JS')
  if (section === 'question' && type === 'HTML') return extractHTML(editor ?? '', 'HTML')
  if (section === 'question' && type === 'CSS') return extractHTML(editor ?? '', 'CSS')
  if (section === 'question' && type === 'JS') return extractHTML(editor ?? '', 'JS')
  return ''
}

export function setLocalStorage(...pairs: [TLocalStorageKey, string][]) {
  for (const [key, value] of pairs) localStorage.setItem(key, value)
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
