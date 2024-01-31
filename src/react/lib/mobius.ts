import { TAlgoResponseValue, TNormalizedSection, TPreviewToken, TQueryPath } from 'type/data'
import { TStore, TStoreProp } from 'type/store'

import { getLocalStorage, preparePreviewDataBody, prepareSaveDataBody, submitData } from './data'
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

export function fetchLegacyPreviewPage({
  algorithm,
  authornotes,
  feedback,
  onSuccess,
  question,
  questionName,
}: Omit<TSaveDataProps<string>, 'isPreview'>) {
  saveData({
    algorithm,
    authornotes,
    feedback,
    isPreview: true,
    onSuccess: (value) => {
      const { questionDefinition, version } = JSON.parse(value) as TPreviewToken
      const body = preparePreviewDataBody(questionDefinition, version)
      submitData({
        body,
        isAlgorithm: false,
        onSuccess,
        url: formURL<TQueryPath>('contentmanager/DisplayQuestion.do', true),
      })
    },
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
