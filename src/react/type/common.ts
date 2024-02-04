import { AllHTMLAttributes, Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'

/**
 * Generic Types:
 * - `TLanguage`: Represents language options for code snippets (CSS, HTML, JS).
 * - `TObject<T, U>`: Represents a generic object with keys of type `T` and values of type `U`.
 *
 * React Types:
 * - `TSetState<T>`: Represents the state setter function from React's useState.
 * - `TProps<T>`: Represents React component props with a generic object and children.
 * - `TComponent<T>`: Represents a generic React component function.
 * - `TReactAttribute`: Represents HTML attributes for React components.
 *
 * HTML Attribute Types:
 * - `TAttributeName`: Represents a union type of HTML attribute names.
 *
 * Node Types:
 * - `TVoidNodeName`, `TBlockNodeName`, `TInlineNodeName`: Represents HTML node names for void, block, and inline elements.
 * - `TNodeName`: Represents a union type of HTML node names.
 *
 * Global Declarations:
 * - `ChildNode`: Extends the ChildNode interface with a custom `nodeName` property.
 * - `Window`: Extends the Window interface with a custom `debouncer` property.
 *
 */

/* Generic */
export type TLanguage = 'CSS' | 'HTML' | 'JS'
export type TObject<T extends number | string = string, U = unknown> = Record<T, U>

/* React */
export type TSetState<T> = Dispatch<SetStateAction<T>>
export type TProps<T = TObject> = T & { children: ReactNode }
export type TComponent<T = unknown> = (props: T) => ReactElement
export type TReactAttribute = AllHTMLAttributes<HTMLElement>

export type TAttributeName =
  | 'accept'
  | 'accept-charset'
  | 'accesskey'
  | 'action'
  | 'align'
  | 'alt'
  | 'async'
  | 'autocomplete'
  | 'autofocus'
  | 'autoplay'
  | 'charset'
  | 'checked'
  | 'cite'
  | 'class'
  | 'cols'
  | 'colspan'
  | 'content'
  | 'contenteditable'
  | 'controls'
  | 'coords'
  | 'data'
  | 'datetime'
  | 'defaultvalue'
  | 'defer'
  | 'dir'
  | 'disabled'
  | 'download'
  | 'enctype'
  | 'for'
  | 'form'
  | 'formaction'
  | 'headers'
  | 'height'
  | 'hidden'
  | 'high'
  | 'href'
  | 'hreflang'
  | 'http-equiv'
  | 'id'
  | 'ismap'
  | 'lang'
  | 'list'
  | 'loop'
  | 'max'
  | 'maxlength'
  | 'media'
  | 'method'
  | 'min'
  | 'multiple'
  | 'muted'
  | 'name'
  | 'novalidate'
  | 'onabort'
  | 'onafterprint'
  | 'onbeforeprint'
  | 'onbeforeunload'
  | 'onblur'
  | 'oncanplay'
  | 'oncanplaythrough'
  | 'onchange'
  | 'onclick'
  | 'oncontextmenu'
  | 'oncopy'
  | 'oncuechange'
  | 'oncut'
  | 'ondblclick'
  | 'ondrag'
  | 'ondragend'
  | 'ondragenter'
  | 'ondragleave'
  | 'ondragover'
  | 'ondragstart'
  | 'ondrop'
  | 'ondurationchange'
  | 'onemptied'
  | 'onended'
  | 'onerror'
  | 'onfocus'
  | 'onhashchange'
  | 'oninput'
  | 'oninvalid'
  | 'onkeydown'
  | 'onkeypress'
  | 'onkeyup'
  | 'onload'
  | 'onloadeddata'
  | 'onloadedmetadata'
  | 'onloadstart'
  | 'onmousedown'
  | 'onmousemove'
  | 'onmouseout'
  | 'onmouseover'
  | 'onmouseup'
  | 'onmousewheel'
  | 'onoffline'
  | 'ononline'
  | 'onpagehide'
  | 'onpageshow'
  | 'onpaste'
  | 'onpause'
  | 'onplay'
  | 'onplaying'
  | 'onpopstate'
  | 'onprogress'
  | 'onratechange'
  | 'onreset'
  | 'onresize'
  | 'onscroll'
  | 'onsearch'
  | 'onseeked'
  | 'onseeking'
  | 'onselect'
  | 'onstalled'
  | 'onstorage'
  | 'onsubmit'
  | 'onsuspend'
  | 'ontimeupdate'
  | 'ontoggle'
  | 'onunload'
  | 'onvolumechange'
  | 'onwaiting'
  | 'onwheel'
  | 'open'
  | 'optimum'
  | 'pattern'
  | 'placeholder'
  | 'poster'
  | 'preload'
  | 'readonly'
  | 'rel'
  | 'required'
  | 'reversed'
  | 'rows'
  | 'rowspan'
  | 'sandbox'
  | 'scope'
  | 'selected'
  | 'shape'
  | 'size'
  | 'sizes'
  | 'span'
  | 'spellcheck'
  | 'src'
  | 'srcset'
  | 'start'
  | 'step'
  | 'style'
  | 'tabindex'
  | 'target'
  | 'title'
  | 'translate'
  | 'type'
  | 'usemap'
  | 'value'
  | 'width'
  | 'wrap'

export type TVoidNodeName = 'AREA' | 'BASE' | 'BR' | 'COL' | 'EMBED' | 'HR' | 'IMG' | 'INPUT' | 'LINK' | 'META' | 'PARAM' | 'SOURCE' | 'TRACK' | 'WBR'
export type TBlockNodeName =
  | 'ADDRESS'
  | 'ARTICLE'
  | 'ASIDE'
  | 'BLOCKQUOTE'
  | 'BODY'
  | 'CANVAS'
  | 'DD'
  | 'DIV'
  | 'DL'
  | 'DT'
  | 'FIELDSET'
  | 'FIGCAPTION'
  | 'FIGURE'
  | 'FOOTER'
  | 'FORM'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'HEADER'
  | 'HGROUP'
  | 'HR'
  | 'LI'
  | 'MAIN'
  | 'NAV'
  | 'NOSCRIPT'
  | 'OL'
  | 'P'
  | 'PRE'
  | 'SECTION'
  | 'TABLE'
  | 'TFOOT'
  | 'UL'
  | 'VIDEO'
export type TInlineNodeName = 'A' | 'ABBR' | 'B' | 'BDO' | 'BR' | 'BUTTON' | 'CITE' | 'CODE' | 'DFN' | 'EM' | 'I' | 'INPUT' | 'KBD' | 'LABEL' | 'MAP' | 'OBJECT' | 'OUTPUT' | 'Q' | 'S' | 'SAMP' | 'SCRIPT' | 'SELECT' | 'SMALL' | 'SPAN' | 'STRONG' | 'SUB' | 'SUP' | 'TEXTAREA' | 'TIME' | 'U' | 'VAR'

export type TNodeName = '#text' | TBlockNodeName | TInlineNodeName | TVoidNodeName

declare global {
  interface ChildNode {
    nodeName: TNodeName
  }
  interface Window {
    debouncer?: NodeJS.Timeout
  }
}
