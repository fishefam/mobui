import { TLanguage } from 'type/common'
import { TAlgoResponseValue, TLocalStorageKey, TNormalizedSection, TPreviewDataKey, TSaveDataKey } from 'type/data'
import { TPanelLayout, TTheme } from 'type/store'

import { extractHTML, getBaseURL } from './util'

/**
 *
 * Props for preparing the body of save data.
 *
 */
type TPrepareSaveDataBodyProps = {
  algorithm: string
  authornotes: string
  feedback: string
  isPreview: boolean
  question: string
  questionName: string
}

type TGetLocalStorageReturn = {
  classId: string
  data: string
  extURL: string
  panelLayout: TPanelLayout
  previewFormContainerId: string
  reactRootId: string
  reponame: string
  rootLoaderId: string
  scriptContainerId: string
  theme: TTheme
  uid: string
  uidHash: string
  username: string
}

/**
 *
 * Props for submitting data.
 * @template T - Type of the algorithm response value.
 *
 */
type TSubmitDataProps<T extends TAlgoResponseValue | string> = {
  body: string
  isAlgorithm: boolean
  onError?: (value: T) => void
  onSuccess: (value: T) => void
  url: string
}

/**
 *
 * Gets the security token from cookies.
 * @returns - Security token.
 *
 */
export function getSecurityToken() {
  return document.cookie.replace('AntiCsrfToken=', '')
}

/**
 *
 * Gets values from local storage.
 * @returns - Local storage values.
 *
 */
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
  const values = keys.map((key) => localStorage.getItem(key)!)
  const entries = keys.map((key, i) => [key, values[i]])
  return Object.fromEntries(entries) as TGetLocalStorageReturn
}

/**
 *
 * Gets data from local storage for a specified section and language.
 * @template T - Type of the normalized section.
 * @param  section - Normalized section.
 * @param  type - Language type.
 * @returns - Retrieved data.
 *
 */
export function getData<T extends TNormalizedSection>(section: T, type: T extends 'algorithm' ? null : TLanguage) {
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

/**
 *
 * Sets values in local storage.
 * @param  pairs - Key-value pairs to set in local storage.
 *
 */
export function setLocalStorage(...pairs: [TLocalStorageKey, string][]) {
  for (const [key, value] of pairs) localStorage.setItem(key, value)
}

/**
 *
 * Prepares the body for saving data.
 * @param  props - Save data body preparation props.
 * @returns - Prepared data body.
 *
 */
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

/**
 *
 * Prepares the body for preview data.
 * @param  questionDefinition - Question definition.
 * @param  version - Version.
 * @returns - Prepared preview data body.
 *
 */
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

/**
 *
 * Submits data to the specified URL.
 * @template T - Type of the algorithm response value.
 * @param  props - Submit data props.
 *
 */
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
