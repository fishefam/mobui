import { TLanguage } from './common'

export type TQueryPath = 'contentmanager/DisplayQuestion.do' | 'qbeditor/SaveDynamicInline.do' | 'rest/algorithms'
export type TPreviewToken = { [key in 'questionDefinition' | 'version']: string }

export type TLocalStorageKey = 'classId' | 'data' | 'extURL' | 'newInterface' | 'reponame' | 'uid' | 'uidHash' | 'username'

export type TSection = 'algorithm' | 'authorNotesEditor' | 'commentEditor' | 'editor'
export type TSectionData = { [key in TSection]: string }

export type TNormalizedSection = 'algorithm' | 'authornotes' | 'feedback' | 'question'
export type TNormalizedSectionData = { [key in TSection]: { [key in TLanguage]: string } }

export type TSaveDataKey = 'AntiCsrfToken' | 'actionId' | 'adaptive' | 'algorithm' | 'authorNotes' | 'authorNotesEditor' | 'classId' | 'comment' | 'commentEditor' | 'editor' | 'hasUnsavedQuestion' | 'name' | 'questionText' | 'uid'
export type TPreviewDataKey = 'AntiCsrfToken' | 'actionID' | 'algorithmic' | 'baseUrl' | 'error' | 'errorMsg' | 'questionDefinition' | 'slideNumber' | 'version'

export type TAlgoResponseValue = { [key in string]: { [key in 'rangeEnd' | 'rangeStart' | 'value']: string } }

// export type TInfoKey = 'actionId' | 'classId' | 'customCss' | 'name' | 'uid'
// export type TCodeKey = 'algorithm'

// export type TInfo_NormalizedKey = 'actionId' | 'classId' | 'customCss' | 'name' | 'uid'
// export type TCode_NormalizedKey = 'algorithm'
// export type TText_NormalizedKey = 'authorNotes' | 'feedback' | 'question'

// export type TInfo_RawData = { [key in TInfoKey]?: string }
// export type TCode_RawData = { [key in TCodeKey]?: string }
// export type TText_RawData = { [key in TTextKey]?: string }

// export type TInfo_NormalizedValues = string
// export type TCode_NormalizedValues = { code: string }
// export type TText_NormalizedValues = { css: string; html: string; javascript: string }

// export type TInfo_NormalizedData = { [key in TInfoKey]: TInfo_NormalizedValues }
// export type TCode_NormalizedData = { [key in TCodeKey]: TCode_NormalizedValues }
// export type TText_NormalizedData = { [key in TTextKey]: TText_NormalizedValues }

// export type TBaseValues<T extends 'CodeMirror' | 'Slate'> = T extends 'CodeMirror' ? string : TValue

// export type TInfo_FinalValues = string
// export type TText_FinalValues = {
//   codemirror: { [key in 'CSS' | 'HTMl' | 'JS']: TBaseValues<'CodeMirror'> }
//   slate: TBaseValues<'Slate'>
// }
// export type TCode_FinalValues = TBaseValues<'CodeMirror'>

// export type TInfoData = { [key in TInfo_NormalizedKey]: TInfo_FinalValues }
// export type TCodeData = { [key in TCode_NormalizedKey]: TCode_FinalValues }
// export type TTextData = { [key in TText_NormalizedKey]: TText_FinalValues }
