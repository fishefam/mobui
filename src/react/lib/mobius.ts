import { TAlgoResponseValue, TNormalizedSection, TPreviewToken, TQueryPath } from 'type/data'
import { TStore, TStoreProp } from 'type/store'

import { getLocalStorage, getSecurityToken, prepareSaveDataBody, submitData } from './data'
import { formURL, getCodeStore, join } from './util'

type TSaveDataProps<T extends TAlgoResponseValue | string> = {
  algorithm: TStoreProp<'algorithm'>
  authornotes: string
  feedback: string
  isPreview: boolean
  onSuccess: (value: T) => void
  question: string
  questionName: TStoreProp<'algorithm'>
}
type TFetchAlgoValue = {
  onSuccess: (value: TAlgoResponseValue) => void
  store: TStore
}
type TFetchLegaacyPreviewPage = Omit<TSaveDataProps<string>, 'isPreview' | 'onSuccess'>

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

export function fetchAlgoValue({ onSuccess, store }: TFetchAlgoValue) {
  const body = getCodeStore(store, 'ALGORITHM', true)[0]
  submitData({
    body,
    isAlgorithm: true,
    onSuccess,
    url: formURL<TQueryPath>('rest/algorithms', true),
  })
}

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

export function joinMobiusData(section: TNormalizedSection, html: string, css: string, js: string) {
  const { uid } = getLocalStorage()
  return join(
    '',
    `<div id="${section}-${uid}">${html}</div>`,
    `<style>${css}</style>`,
    `<script>(function(){${js}})()</script>`,
  )
}

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
