import { TLanguage } from './common'

/**
 * Custom Types for Query Paths, Tokens, Local Storage Keys, Sections, and Data
 *
 * - `TQueryPath`: Represents specific paths for API queries.
 * - `TPreviewToken`: Represents a token object for preview data with keys 'questionDefinition' and 'version'.
 * - `TLocalStorageKey`: Represents keys used for local storage in the application.
 *
 * - `TSection`: Represents different sections in the application.
 * - `TSectionData`: Represents a mapping of section names to corresponding data.
 *
 * - `TNormalizedSection`: Represents normalized section names in the application.
 * - `TNormalizedSectionData`: Represents a mapping of normalized section names to language-specific data.
 *
 * - `TSaveDataKey`: Represents keys for saving data in the application.
 * - `TPreviewDataKey`: Represents keys for preview data in the application.
 *
 * - `TAlgoResponseValue`: Represents a response value with dynamic keys and specific properties.
 *
 */

export type TQueryPath = 'contentmanager/DisplayQuestion.do' | 'qbeditor/SaveDynamicInline.do' | 'rest/algorithms'
export type TPreviewToken = { [key in 'questionDefinition' | 'version']: string }

export type TLocalStorageKey = 'classId' | 'data' | 'extSwitchKey' | 'extURL' | 'panelLayout' | 'previewFormContainerId' | 'reactRootId' | 'reponame' | 'rootLoaderId' | 'scriptContainerId' | 'theme' | 'uid' | 'uidHash' | 'username'

export type TSection = 'algorithm' | 'authorNotesEditor' | 'commentEditor' | 'editor'
export type TSectionData = { [key in TSection]: string }

export type TNormalizedSection = 'algorithm' | 'authornotes' | 'feedback' | 'question'
export type TNormalizedSectionData = { [key in TSection]: { [key in TLanguage]: string } }

export type TSaveDataKey = 'AntiCsrfToken' | 'actionId' | 'adaptive' | 'algorithm' | 'authorNotes' | 'authorNotesEditor' | 'classId' | 'comment' | 'commentEditor' | 'editor' | 'hasUnsavedQuestion' | 'name' | 'questionText' | 'uid'
export type TPreviewDataKey = 'AntiCsrfToken' | 'actionID' | 'algorithmic' | 'baseUrl' | 'error' | 'errorMsg' | 'questionDefinition' | 'slideNumber' | 'version'

export type TAlgoResponseValue = { [key in string]: { [key in 'rangeEnd' | 'rangeStart' | 'value']: string } }
