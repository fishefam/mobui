import { TStore, TStoreProp } from 'type/store'

import { getCodeStore } from './util'

type TSaveDataProps = {
  algorithm: TStoreProp<'algorithm'>
  authornotesHTML: TStoreProp<'authornotesHTML'>
  callback: (json: string) => void
  classId: string
  feedbackHTML: TStoreProp<'feedbackHTML'>
  isPreview: boolean
  questionHTML: TStoreProp<'questionHTML'>
  questionName: TStoreProp<'questionName'>
}

export function saveData({
  algorithm,
  authornotesHTML,
  callback,
  classId,
  feedbackHTML,
  isPreview,
  questionHTML,
  questionName,
}: TSaveDataProps) {
  const formData = new FormData()
  const data = [
    ['actionId', isPreview ? 'preview' : 'savedraft'],
    ['adaptive', 'false'],
    ['algorithm', algorithm],
    ['AntiCsrfToken', document.cookie.replace('AntiCsrfToken=', '')],
    ['authorNotes', authornotesHTML],
    ['authorNotesEditor', authornotesHTML],
    ['classId', classId],
    ['comment', feedbackHTML],
    ['commentEditor', feedbackHTML],
    ['editor', questionHTML],
    ['hasUnsavedQuestion', 'Unsaved changes to the current question will be lost.'],
    ['name', questionName],
    ['questionText', questionHTML],
    ['uid', localStorage.getItem('uid') ?? ''],
  ] as const
  for (const [key, value] of data) formData.set(key, value)
  const body = new URLSearchParams(formData as unknown as URLSearchParams).toString()
  fetch('https://mohawk-math.mobius.cloud/qbeditor/SaveDynamicInline.do', {
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  })
    .then((response) => response.text())
    .then((html) => callback(html))
    .catch((err) => console.log(err))
}

export function fetchAlgoValue(store: TStore, callback: (value: TStoreProp<'algorithmPreview'>) => void) {
  fetch(`${location.origin}/rest/algorithms?${document.cookie}`, {
    body: getCodeStore(store, 'ALGORITHM', true)[0],
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
    .then(async (response) => response.json())
    .then((value) => callback(value))
    .catch((err) => console.log(err))
}

export function fetchLegacyPreviewPage({
  algorithm,
  authornotesHTML,
  callback,
  feedbackHTML,
  questionHTML,
  questionName,
}: Omit<TSaveDataProps, 'classId' | 'isPreview'>) {
  saveData({
    algorithm,
    authornotesHTML,
    callback: (json) => {
      const { questionDefinition, version } = JSON.parse(json) as { questionDefinition: string; version: string }
      const formData = new FormData()
      const data = [
        ['actionID', 'display'],
        ['algorithmic', 'false'],
        ['AntiCsrfToken', document.cookie.replace('AntiCsrfToken=', '')],
        ['baseUrl', location.origin],
        ['error', 'false'],
        ['errorMsg', ''],
        ['questionDefinition', questionDefinition],
        ['slideNumber', ''],
        ['version', version],
      ] as const
      for (const [key, value] of data) formData.set(key, value)
      const body = new URLSearchParams(formData as unknown as URLSearchParams).toString()
      fetch('https://mohawk-math.mobius.cloud/contentmanager/DisplayQuestion.do', {
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      })
        .then((response) => response.text())
        .then((html) => callback(html))
        .catch((err) => console.log(err))
    },
    classId: localStorage.getItem('classId') ?? '',
    feedbackHTML,
    isPreview: true,
    questionHTML,
    questionName,
  })
}
