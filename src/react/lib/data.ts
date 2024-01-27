import type { EditorStateConfig, EditorViewConfig } from '@uiw/react-codemirror'
import { EditorState, EditorView } from '@uiw/react-codemirror'
import type {
  TBaseValues,
  TCode_NormalizedData,
  TCode_RawData,
  TCodeKey,
  TInfo_NormalizedData,
  TInfo_RawData,
  TInfoData,
  TText_FinalValues,
  TText_NormalizedData,
  TText_NormalizedKey,
  TText_RawData,
  TTextData,
  TTextKey,
} from 'type/data'
import { createState, type TValue } from 'type/slate'

import { extractHTML, MOBIUS_DATA_KEY, prettierSync } from './util'

export function getInfo_RawData(): TInfo_RawData {
  const {
    actionId = '',
    classId = '',
    customCss = '',
    name = '',
    uid = '',
  } = JSON.parse(localStorage.getItem(MOBIUS_DATA_KEY)!) as TInfo_RawData
  return { actionId, classId, customCss, name, uid }
}
export function getText_RawData(): TText_RawData {
  const {
    authorNotesEditor = '',
    commentEditor = '',
    editor = '',
  } = JSON.parse(localStorage.getItem(MOBIUS_DATA_KEY)!) as TText_RawData
  return { authorNotesEditor, commentEditor, editor }
}
export function getCode_RawData(): TCode_RawData {
  const { algorithm = '' } = JSON.parse(localStorage.getItem(MOBIUS_DATA_KEY)!) as TCode_RawData
  return { algorithm }
}

export function normalizeInfoData(data: TInfo_RawData): TInfo_NormalizedData {
  const { actionId = '', classId = '', customCss = '', name = '', uid = '' } = data
  return { actionId, classId, customCss, name, uid }
}
export function normalizeCodeData(data: TCode_RawData): TCode_NormalizedData {
  const keys = Object.keys(data) as TCodeKey[]
  const values = Object.values(data)
  const transforms = values.map((v) => ({ code: v }))
  const merge = keys.map((k, i) => [k, transforms[i]])
  return Object.fromEntries(merge)
}
export function normalizeTextData(data: TText_RawData): TText_NormalizedData {
  const keys = Object.keys(data) as TTextKey[]
  const values = Object.values(data)
  const transforms = values.map((v) => ({
    css: prettierSync(extractHTML(v, 'css'), 'css'),
    html: prettierSync(extractHTML(v, 'html'), 'html'),
    javascript: prettierSync(extractHTML(v, 'javascript'), 'javascript'),
  }))
  const merge = keys.map((k, i) => [k, transforms[i]])
  return Object.fromEntries(merge)
}

export function prepareTextData(data: TText_NormalizedData, _?: object): TTextData {
  const keys: TText_NormalizedKey[] = ['authorNotes', 'feedback', 'question']
  const values = Object.values(data)
  const transforms = values.map<TText_FinalValues>((v) => ({
    codemirror: {
      css: createCodeMirrorBaseValues(v.css),
      html: createCodeMirrorBaseValues(v.html),
      javascript: createCodeMirrorBaseValues(v.javascript),
    },
    slate: createSlateBaseValues(deserialize(v)),
  }))
  const merge = keys.map((k, i) => [k, transforms[i]])
  return Object.fromEntries(merge)
}

export function prepareInfoData() {
  return getInfo_RawData() as TInfoData
}

// export function prepareCodeData(
//   data: TCode_NormalizedData,
//   options?: {
//     codeStateConfig?: EditorViewConfig
//     codeViewConfig?: EditorStateConfig
//     plateEditorConfig?: CreatePlateEditorOptions<TDocument, PlateEditor<TDocument>>
//   },
// ): TCodeData {
//   const keys: (keyof TCodeData)[] = ['algorithm']
//   const values = Object.values(data)
//   const transforms = values.map<TFinalCodeDataProps>((v) => ({
//     code: {
//       state: EditorState.create(options?.codeStateConfig),
//       value: v.code,
//       view: new EditorView(options?.codeViewConfig),
//     },
//   }))
//   const merge = keys.map((k, i) => [k, transforms[i]])
//   return Object.fromEntries(merge)
// }

// export function isTextData(preparedData: TCodeData | TTextData): preparedData is TTextData {
//   const data = preparedData as TTextData
//   return typeof data.authorNotes !== 'undefined'
// }

function createCodeMirrorBaseValues(
  value: string,
  configs?: { state?: EditorStateConfig; view?: EditorViewConfig },
): TBaseValues<'CodeMirror'> {
  return { state: EditorState.create(configs?.state), value, view: new EditorView(configs?.view) }
}

function createSlateBaseValues(value: TValue): TBaseValues<'Slate'> {
  return { state: createState(), value }
}

// function isCodeMirrorData(preparedData: TCodeData | TTextData): preparedData is TCodeData {
//   const data = preparedData as TCodeData
//   return typeof data.algorithm !== 'undefined'
// }
