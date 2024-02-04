import { TAlgoResponseValue, TNormalizedSection, TPreviewToken, TQueryPath } from 'type/data'
import { TStore, TStoreProp } from 'type/store'

import { getLocalStorage, getSecurityToken, prepareSaveDataBody, submitData } from './data'
import { formURL, getCodeStore, join } from './util'

/**
 * Props for saving data for Mobius algorithm or legacy document.
 * @template T - Type of the algorithm response value.
 */
type TSaveDataProps<T extends TAlgoResponseValue | string> = {
  algorithm: TStoreProp<'algorithm'>
  authornotes: string
  feedback: string
  isPreview: boolean
  onSuccess: (value: T) => void
  question: string
  questionName: TStoreProp<'algorithm'>
}

/**
 * Props for fetching algorithm value.
 */
type TFetchAlgoValue = {
  onSuccess: (value: TAlgoResponseValue) => void
  store: TStore
}

/**
 * Props for fetching legacy preview page data.
 */
type TFetchLegaacyPreviewPage = Omit<TSaveDataProps<string>, 'isPreview' | 'onSuccess'>

/**
 *
 * Saves data for Mobius algorithm or legacy document.
 * @param props - Save data props.
 *
 */
export function saveData({
  algorithm,
  authornotes,
  feedback,
  isPreview = false,
  onSuccess,
  question,
  questionName,
}: TSaveDataProps<string>) {
  const body = prepareSaveDataBody({ algorithm, authornotes, feedback, isPreview, question, questionName })
  submitData({
    body,
    isAlgorithm: false,
    onSuccess,
    url: formURL<TQueryPath>('qbeditor/SaveDynamicInline.do', true),
  })
}

/**
 *
 * Fetches algorithm value.
 * @param props - Fetch algorithm value props.
 *
 */
export function fetchAlgoValue({ onSuccess, store }: TFetchAlgoValue) {
  const body = getCodeStore(store, 'ALGORITHM', true)[0]
  submitData({
    body,
    isAlgorithm: true,
    onSuccess,
    url: formURL<TQueryPath>('rest/algorithms', true),
  })
}

/**
 *
 * Fetches legacy preview page data.
 * @param props - Fetch legacy preview page props.
 *
 */
export function previewLegacyDocument({
  algorithm,
  authornotes,
  feedback,
  question,
  questionName,
}: TFetchLegaacyPreviewPage) {
  saveData({
    algorithm,
    authornotes,
    feedback,
    isPreview: true,
    onSuccess: (value) => displayLegacyPreview(JSON.parse(value) as TPreviewToken),
    question,
    questionName,
  })
}

/**
 *
 * Joins Mobius data.
 * @param section - Normalized section.
 * @param html - HTML content.
 * @param css - CSS content.
 * @param js - JavaScript content.
 * @returns {string} - Joined Mobius data.
 *
 */
export function joinMobiusData(section: TNormalizedSection, html: string, css: string, js: string) {
  const { uid } = getLocalStorage()
  return join(
    '',
    `<div id="${section}-${uid}">${html}</div>`,
    `<style>${css}</style>`,
    `<script>(function(){${js}})()</script>`,
  )
}

/**
 *
 * Displays legacy preview.
 * @param param0 - Preview token.
 *
 */
function displayLegacyPreview({ questionDefinition, version }: TPreviewToken) {
  const path: TQueryPath = 'contentmanager/DisplayQuestion.do'
  const formHTML = `
<form name="preview" action="${'/' + path}" method="POST" style="display:none;">
  <input name="actionID" value="display">
  <input name="questionDefinition" value="${questionDefinition}">
  <input name="algorithmic" value="false">
  <input name="baseUrl" value="${location.origin}">
  <input name="slideNumber">
  <input name="error" value="false">
  <input name="errorMsg" value="">
  <input name="version" value="${version}">
  <input name="AntiCsrfToken" value="${getSecurityToken()}">
</form>`
  const form = new DOMParser().parseFromString(formHTML.trim(), 'text/html').forms[0]
  const preview = window.open('/' + path, 'newWindow', 'width=960')
  if (preview)
    preview.window.onload = () => {
      preview.window.document.body.appendChild(form)
      form.submit()
    }
}
