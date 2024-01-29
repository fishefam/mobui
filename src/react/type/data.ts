import { TValue } from './slate'

export type TInfoKey = 'actionId' | 'classId' | 'customCss' | 'name' | 'uid'
export type TCodeKey = 'algorithm'
export type TTextKey = 'authorNotesEditor' | 'commentEditor' | 'editor'

export type TInfo_NormalizedKey = 'actionId' | 'classId' | 'customCss' | 'name' | 'uid'
export type TCode_NormalizedKey = 'algorithm'
export type TText_NormalizedKey = 'authorNotes' | 'feedback' | 'question'

export type TInfo_RawData = { [key in TInfoKey]?: string }
export type TCode_RawData = { [key in TCodeKey]?: string }
export type TText_RawData = { [key in TTextKey]?: string }

export type TInfo_NormalizedValues = string
export type TCode_NormalizedValues = { code: string }
export type TText_NormalizedValues = { css: string; html: string; javascript: string }

export type TInfo_NormalizedData = { [key in TInfoKey]: TInfo_NormalizedValues }
export type TCode_NormalizedData = { [key in TCodeKey]: TCode_NormalizedValues }
export type TText_NormalizedData = { [key in TTextKey]: TText_NormalizedValues }

export type TBaseValues<T extends 'CodeMirror' | 'Slate'> = T extends 'CodeMirror' ? string : TValue

export type TInfo_FinalValues = string
export type TText_FinalValues = {
  codemirror: { [key in 'CSS' | 'HTMl' | 'JS']: TBaseValues<'CodeMirror'> }
  slate: TBaseValues<'Slate'>
}
export type TCode_FinalValues = TBaseValues<'CodeMirror'>

export type TInfoData = { [key in TInfo_NormalizedKey]: TInfo_FinalValues }
export type TCodeData = { [key in TCode_NormalizedKey]: TCode_FinalValues }
export type TTextData = { [key in TText_NormalizedKey]: TText_FinalValues }
