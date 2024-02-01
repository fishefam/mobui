import { TLanguage } from './common'

export type TQueryPath = 'contentmanager/DisplayQuestion.do' | 'qbeditor/SaveDynamicInline.do' | 'rest/algorithms'
export type TPreviewToken = { [key in 'questionDefinition' | 'version']: string }

export type TLocalStorageKey = 'classId' | 'data' | 'extSwitchKey' | 'extURL' | 'previewFormContainerId' | 'reactRootId' | 'reponame' | 'rootLoaderId' | 'theme' | 'uid' | 'uidHash' | 'username'

export type TSection = 'algorithm' | 'authorNotesEditor' | 'commentEditor' | 'editor'
export type TSectionData = { [key in TSection]: string }

export type TNormalizedSection = 'algorithm' | 'authornotes' | 'feedback' | 'question'
export type TNormalizedSectionData = { [key in TSection]: { [key in TLanguage]: string } }

export type TSaveDataKey = 'AntiCsrfToken' | 'actionId' | 'adaptive' | 'algorithm' | 'authorNotes' | 'authorNotesEditor' | 'classId' | 'comment' | 'commentEditor' | 'editor' | 'hasUnsavedQuestion' | 'name' | 'questionText' | 'uid'
export type TPreviewDataKey = 'AntiCsrfToken' | 'actionID' | 'algorithmic' | 'baseUrl' | 'error' | 'errorMsg' | 'questionDefinition' | 'slideNumber' | 'version'

export type TAlgoResponseValue = { [key in string]: { [key in 'rangeEnd' | 'rangeStart' | 'value']: string } }
