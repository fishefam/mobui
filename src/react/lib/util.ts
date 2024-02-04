import { Completion, snippetCompletion } from '@codemirror/autocomplete'
import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { Options } from 'prettier'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'
import html from 'prettier/plugins/html'
import css from 'prettier/plugins/postcss'
import typescript from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'
import { twMerge } from 'tailwind-merge'
import { TAttributeName, TLanguage, TObject, TReactAttribute, TSetState } from 'type/common'
import { TLocalStorageKey, TNormalizedSection } from 'type/data'
import { TStore, TStoreCodeKey } from 'type/store'

import { getData, getLocalStorage } from './data'

/**
 * Get the base URL of the current location.
 *
 * @returns - The base URL.
 */
export function getBaseURL() {
  return location.origin
}

/**
 * Form a URL by combining the base URL, class ID, path, and cookies.
 *
 * @param path - The path to append to the URL.
 * @param noClassId - Flag to exclude class ID from the URL.
 * @returns - The generated URL.
 */
export function formURL<T extends string>(path: T, noClassId = false) {
  const { classId } = getLocalStorage()
  const _classId = classId.length ? classId : '#'
  const _path = path.replace(/^\//, '')
  return `${location.origin}${noClassId ? '' : `/${_classId}`}/${_path}?${document.cookie}`
}

/**
 * Join an array of strings into a single string using the specified separator.
 *
 * @param separator - The string used to separate the array elements.
 * @param strings - The strings to be joined.
 * @returns - The joined string.
 */
export function join(separator: string, ...strings: string[]) {
  return strings.join(separator)
}

/**
 * Generate BEM (Block Element Modifier) class names.
 *
 * @param block - The block name.
 * @param element - The optional element name.
 * @param modifier - The optional modifier name.
 * @returns - The generated BEM class name.
 */
export function bem(block: string, element?: string, modifier?: string): string {
  return `${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`
}

/**
 * Extract HTML or CSS content from a given HTML string based on the specified language.
 *
 * @param htmlString - The input HTML string.
 * @param language - The language to extract (HTML or CSS).
 * @returns - The extracted content.
 */
export function extractHTML(htmlString: string, language: TLanguage) {
  if (language === 'CSS') return (htmlString.match(/(?<=<style.*>)(.|\n)*?(?=<\/style>)/g) ?? []).join(' ')

  const dom = new DOMParser().parseFromString(htmlString, 'text/html').body
  const elements = Array.from(dom.children).filter(({ nodeName }) =>
    language === 'HTML' ? nodeName !== 'SCRIPT' : nodeName === 'SCRIPT',
  ) as HTMLElement[]
  const htmls = elements.map(({ innerHTML, outerHTML }) => (language === 'HTML' ? outerHTML : innerHTML))
  return language === 'HTML' ? htmls.join('').replace(/<style.*>(.|\n)*?<\/style>/g, '') : htmls.join('')
}

/**
 * Generate a random string of the specified size using the nanoid algorithm.
 *
 * @param size - The length of the generated string (default is 9).
 * @returns - The generated random string.
 */
export function nanoid(size: number = 9): string {
  const characterSet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  return customAlphabet(characterSet, size)()
}

/**
 * Combine multiple class values into a single string using Tailwind CSS utility functions.
 *
 * @param inputs - The class values to be combined.
 * @returns - The combined class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Convert a string to start case (capitalize the first letter of each word).
 *
 * @param input - The input string.
 * @returns - The string converted to start case.
 */
export function toStartCase(input: string): string {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
    .join(' ')
}

/**
 * Get the value of a specific item from the local storage.
 *
 * @param key - The key of the item to retrieve.
 * @returns - The value of the item or an empty string if not found.
 */
export function getLocalStorageItem(key: TLocalStorageKey): string {
  return localStorage.getItem(key) ?? ''
}

/**
 * Convert a snake_case string to camelCase.
 *
 * @param input - The input string in snake_case.
 * @returns - The string converted to camelCase.
 */
export function snakeToCamel(input: string) {
  return input
    .split('-')
    .map((value, i) => (i > 0 ? value.charAt(0).toUpperCase().concat(value.slice(1)) : value))
    .join('')
}

/**
 * Parse HTML content from a normalized section and return the DOM.
 *
 * @param section - The normalized section.
 * @returns - The parsed DOM document.
 */
export function getDOM(section: TNormalizedSection, html?: string) {
  if (html) return new DOMParser().parseFromString(html.replace(/>(\s|\t|\r|\n|\v)*</g, '><'), 'text/html').body
  return new DOMParser().parseFromString(getData(section, 'HTML').replace(/>(\s|\t|\r|\n|\v)*</g, '><'), 'text/html')
    .body
}

/**
 * Convert a NamedNodeMap to a React attribute object, optionally removing specified keys.
 *
 * @param map - The NamedNodeMap to convert.
 * @param removingKeys - The keys to be removed.
 * @returns - The React attribute object.
 */
export function namedNodeMapToReactAttribute(
  map?: NamedNodeMap,
  ...removingKeys: TAttributeName[]
): { [key in keyof TReactAttribute]: string } {
  if (map) {
    for (const key of [...removingKeys, 'data-slate-node', 'data-slate-fragment'])
      if (map.getNamedItem(key)) map.removeNamedItem(key)
    return Object.fromEntries(
      Object.values(map).map(({ nodeName, textContent }) => {
        const name = <TAttributeName>nodeName
        if (name === 'for') return ['htmlFor', textContent]
        if (name === 'defaultvalue') return ['defaultValue', textContent]
        if (textContent) return [nodeName, textContent]
        return [nodeName, '']
      }),
    )
  }
  return {}
}

/**
 * Check if a given object has all the specified keys.
 *
 * @template T - The string literal type of keys.
 * @template U - The type of the property value.
 * @param keys - The keys to check in the object.
 * @param property - The object to check for keys.
 * @returns - True if the object has all the specified keys.
 */
export function hasProps<T extends string, U>(keys: T[], property: TObject): property is { [key in T]: U } {
  const checks = keys.map((key) => !!property[key]).filter((v) => !v)
  return checks.length === 0
}

/**
 * Check if a given string is one of the specified strings.
 *
 * @template T - The string literal type.
 * @param strings - The array of strings to check against.
 * @param value - The value to check.
 * @returns - True if the value is one of the specified strings.
 */
export function hasString<T extends string>(strings: T[], value = ''): value is T {
  return strings.includes(value as T)
}

/**
 * Format code using Prettier based on the specified language.
 *
 * @param value - The code to format.
 * @param language - The language of the code.
 * @returns - The formatted code.
 */
export function prettier(value: string, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS') {
  const option: Options = {
    parser: language === 'HTML' ? 'html' : language === 'CSS' ? 'css' : 'typescript',
    plugins: language === 'HTML' ? [babel, estree, html] : language === 'CSS' ? [css] : [typescript, estree, babel],
  }

  return format(value, {
    ...option,
    htmlWhitespaceSensitivity: 'ignore',
    printWidth: 40,
    semi: true,
    singleAttributePerLine: true,
    trailingComma: 'none',
    useTabs: false,
  })
}

/**
 * Get the base JavaScript code completion list, including keywords and snippets.
 *
 * @returns - The list of JavaScript code completions.
 */
export function getBaseJsCompletion() {
  const kwCompletion = (name: string) => ({ label: name, type: 'keyword' })
  const keywords =
    'break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield'
      .split(' ')
      .map(kwCompletion)
  const snippets: readonly Completion[] = [
    snippetCompletion('function ${name}(${params}) {\n\t${}\n}', {
      detail: 'definition',
      label: 'function',
      type: 'keyword',
    }),
    snippetCompletion('for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}', {
      detail: 'loop',
      label: 'for',
      type: 'keyword',
    }),
    snippetCompletion('for (let ${name} of ${collection}) {\n\t${}\n}', {
      detail: 'of loop',
      label: 'for',
      type: 'keyword',
    }),
    snippetCompletion('do {\n\t${}\n} while (${})', {
      detail: 'loop',
      label: 'do',
      type: 'keyword',
    }),
    snippetCompletion('while (${}) {\n\t${}\n}', {
      detail: 'loop',
      label: 'while',
      type: 'keyword',
    }),
    snippetCompletion('try {\n\t${}\n} catch (${error}) {\n\t${}\n}', {
      detail: '/ catch block',
      label: 'try',
      type: 'keyword',
    }),
    snippetCompletion('if (${}) {\n\t${}\n}', {
      detail: 'block',
      label: 'if',
      type: 'keyword',
    }),
    snippetCompletion('if (${}) {\n\t${}\n} else {\n\t${}\n}', {
      detail: '/ else block',
      label: 'if',
      type: 'keyword',
    }),
    snippetCompletion('class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}', {
      detail: 'definition',
      label: 'class',
      type: 'keyword',
    }),
  ]
  return snippets.concat(keywords)
}

export function getBaseCssCompletion() {
  const pseudoClasses = [
    'active',
    'after',
    'any-link',
    'autofill',
    'backdrop',
    'before',
    'checked',
    'cue',
    'default',
    'defined',
    'disabled',
    'empty',
    'enabled',
    'file-selector-button',
    'first',
    'first-child',
    'first-letter',
    'first-line',
    'first-of-type',
    'focus',
    'focus-visible',
    'focus-within',
    'fullscreen',
    'has',
    'host',
    'host-context',
    'hover',
    'in-range',
    'indeterminate',
    'invalid',
    'is',
    'lang',
    'last-child',
    'last-of-type',
    'left',
    'link',
    'marker',
    'modal',
    'not',
    'nth-child',
    'nth-last-child',
    'nth-last-of-type',
    'nth-of-type',
    'only-child',
    'only-of-type',
    'optional',
    'out-of-range',
    'part',
    'placeholder',
    'placeholder-shown',
    'read-only',
    'read-write',
    'required',
    'right',
    'root',
    'scope',
    'selection',
    'slotted',
    'target',
    'target-text',
    'valid',
    'visited',
    'where',
  ].map((name) => ({ label: name, type: 'class' }))
  const values = [
    'above',
    'absolute',
    'activeborder',
    'additive',
    'activecaption',
    'after-white-space',
    'ahead',
    'alias',
    'all',
    'all-scroll',
    'alphabetic',
    'alternate',
    'always',
    'antialiased',
    'appworkspace',
    'asterisks',
    'attr',
    'auto',
    'auto-flow',
    'avoid',
    'avoid-column',
    'avoid-page',
    'avoid-region',
    'axis-pan',
    'background',
    'backwards',
    'baseline',
    'below',
    'bidi-override',
    'blink',
    'block',
    'block-axis',
    'bold',
    'bolder',
    'border',
    'border-box',
    'both',
    'bottom',
    'break',
    'break-all',
    'break-word',
    'bullets',
    'button',
    'button-bevel',
    'buttonface',
    'buttonhighlight',
    'buttonshadow',
    'buttontext',
    'calc',
    'capitalize',
    'caps-lock-indicator',
    'caption',
    'captiontext',
    'caret',
    'cell',
    'center',
    'checkbox',
    'circle',
    'cjk-decimal',
    'clear',
    'clip',
    'close-quote',
    'col-resize',
    'collapse',
    'color',
    'color-burn',
    'color-dodge',
    'column',
    'column-reverse',
    'compact',
    'condensed',
    'contain',
    'content',
    'contents',
    'content-box',
    'context-menu',
    'continuous',
    'copy',
    'counter',
    'counters',
    'cover',
    'crop',
    'cross',
    'crosshair',
    'currentcolor',
    'cursive',
    'cyclic',
    'darken',
    'dashed',
    'decimal',
    'decimal-leading-zero',
    'default',
    'default-button',
    'dense',
    'destination-atop',
    'destination-in',
    'destination-out',
    'destination-over',
    'difference',
    'disc',
    'discard',
    'disclosure-closed',
    'disclosure-open',
    'document',
    'dot-dash',
    'dot-dot-dash',
    'dotted',
    'double',
    'down',
    'e-resize',
    'ease',
    'ease-in',
    'ease-in-out',
    'ease-out',
    'element',
    'ellipse',
    'ellipsis',
    'embed',
    'end',
    'ethiopic-abegede-gez',
    'ethiopic-halehame-aa-er',
    'ethiopic-halehame-gez',
    'ew-resize',
    'exclusion',
    'expanded',
    'extends',
    'extra-condensed',
    'extra-expanded',
    'fantasy',
    'fast',
    'fill',
    'fill-box',
    'fixed',
    'flat',
    'flex',
    'flex-end',
    'flex-start',
    'footnotes',
    'forwards',
    'from',
    'geometricPrecision',
    'graytext',
    'grid',
    'groove',
    'hand',
    'hard-light',
    'help',
    'hidden',
    'hide',
    'higher',
    'highlight',
    'highlighttext',
    'horizontal',
    'hsl',
    'hsla',
    'hue',
    'icon',
    'ignore',
    'inactiveborder',
    'inactivecaption',
    'inactivecaptiontext',
    'infinite',
    'infobackground',
    'infotext',
    'inherit',
    'initial',
    'inline',
    'inline-axis',
    'inline-block',
    'inline-flex',
    'inline-grid',
    'inline-table',
    'inset',
    'inside',
    'intrinsic',
    'invert',
    'italic',
    'justify',
    'keep-all',
    'landscape',
    'large',
    'larger',
    'left',
    'level',
    'lighter',
    'lighten',
    'line-through',
    'linear',
    'linear-gradient',
    'lines',
    'list-item',
    'listbox',
    'listitem',
    'local',
    'logical',
    'loud',
    'lower',
    'lower-hexadecimal',
    'lower-latin',
    'lower-norwegian',
    'lowercase',
    'ltr',
    'luminosity',
    'manipulation',
    'match',
    'matrix',
    'matrix3d',
    'medium',
    'menu',
    'menutext',
    'message-box',
    'middle',
    'min-intrinsic',
    'mix',
    'monospace',
    'move',
    'multiple',
    'multiple_mask_images',
    'multiply',
    'n-resize',
    'narrower',
    'ne-resize',
    'nesw-resize',
    'no-close-quote',
    'no-drop',
    'no-open-quote',
    'no-repeat',
    'none',
    'normal',
    'not-allowed',
    'nowrap',
    'ns-resize',
    'numbers',
    'numeric',
    'nw-resize',
    'nwse-resize',
    'oblique',
    'opacity',
    'open-quote',
    'optimizeLegibility',
    'optimizeSpeed',
    'outset',
    'outside',
    'outside-shape',
    'overlay',
    'overline',
    'padding',
    'padding-box',
    'painted',
    'page',
    'paused',
    'perspective',
    'pinch-zoom',
    'plus-darker',
    'plus-lighter',
    'pointer',
    'polygon',
    'portrait',
    'pre',
    'pre-line',
    'pre-wrap',
    'preserve-3d',
    'progress',
    'push-button',
    'radial-gradient',
    'radio',
    'read-only',
    'read-write',
    'read-write-plaintext-only',
    'rectangle',
    'region',
    'relative',
    'repeat',
    'repeating-linear-gradient',
    'repeating-radial-gradient',
    'repeat-x',
    'repeat-y',
    'reset',
    'reverse',
    'rgb',
    'rgba',
    'ridge',
    'right',
    'rotate',
    'rotate3d',
    'rotateX',
    'rotateY',
    'rotateZ',
    'round',
    'row',
    'row-resize',
    'row-reverse',
    'rtl',
    'run-in',
    'running',
    's-resize',
    'sans-serif',
    'saturation',
    'scale',
    'scale3d',
    'scaleX',
    'scaleY',
    'scaleZ',
    'screen',
    'scroll',
    'scrollbar',
    'scroll-position',
    'se-resize',
    'self-start',
    'self-end',
    'semi-condensed',
    'semi-expanded',
    'separate',
    'serif',
    'show',
    'single',
    'skew',
    'skewX',
    'skewY',
    'skip-white-space',
    'slide',
    'slider-horizontal',
    'slider-vertical',
    'sliderthumb-horizontal',
    'sliderthumb-vertical',
    'slow',
    'small',
    'small-caps',
    'small-caption',
    'smaller',
    'soft-light',
    'solid',
    'source-atop',
    'source-in',
    'source-out',
    'source-over',
    'space',
    'space-around',
    'space-between',
    'space-evenly',
    'spell-out',
    'square',
    'start',
    'static',
    'status-bar',
    'stretch',
    'stroke',
    'stroke-box',
    'sub',
    'subpixel-antialiased',
    'svg_masks',
    'super',
    'sw-resize',
    'symbolic',
    'symbols',
    'system-ui',
    'table',
    'table-caption',
    'table-cell',
    'table-column',
    'table-column-group',
    'table-footer-group',
    'table-header-group',
    'table-row',
    'table-row-group',
    'text',
    'text-bottom',
    'text-top',
    'textarea',
    'textfield',
    'thick',
    'thin',
    'threeddarkshadow',
    'threedface',
    'threedhighlight',
    'threedlightshadow',
    'threedshadow',
    'to',
    'top',
    'transform',
    'translate',
    'translate3d',
    'translateX',
    'translateY',
    'translateZ',
    'transparent',
    'ultra-condensed',
    'ultra-expanded',
    'underline',
    'unidirectional-pan',
    'unset',
    'up',
    'upper-latin',
    'uppercase',
    'url',
    'var',
    'vertical',
    'vertical-text',
    'view-box',
    'visible',
    'visibleFill',
    'visiblePainted',
    'visibleStroke',
    'visual',
    'w-resize',
    'wait',
    'wave',
    'wider',
    'window',
    'windowframe',
    'windowtext',
    'words',
    'wrap',
    'wrap-reverse',
    'x-large',
    'x-small',
    'xor',
    'xx-large',
    'xx-small',
  ]
    .map((name) => ({ label: name, type: 'keyword' }))
    .concat(
      [
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'grey',
        'green',
        'greenyellow',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategray',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'rebeccapurple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen',
      ].map((name) => ({ label: name, type: 'constant' })),
    )

  const tags = [
    'a',
    'abbr',
    'address',
    'article',
    'aside',
    'b',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'figcaption',
    'figure',
    'footer',
    'form',
    'header',
    'hgroup',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'main',
    'meter',
    'nav',
    'ol',
    'output',
    'p',
    'pre',
    'ruby',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ].map((name) => ({ label: name, type: 'type' }))
  return [...pseudoClasses, ...values, ...tags]
}

/**
 * Update JavaScript code completion list based on HTML content.
 *
 * @param html - The HTML content to extract IDs from.
 * @param setCompletion - The state setter for the completion list.
 */
export function updateCompletionList(html: string, language: 'CSS' | 'JS', setCompletion: TSetState<Completion[]>) {
  const ids = (html.match(/id="([^"]*)"/gi) ?? []).map((match) => match.replace(/^id="|"$/g, ''))
  const completionList: Completion[] = ids.map((id) =>
    language === 'JS'
      ? snippetCompletion(`document.querySelector("#${id}")`, { label: `select ${id}`, type: 'method' })
      : snippetCompletion(`#${id} {\n\t\${}\n}`, { label: `select ${id}` }),
  )
  setCompletion(completionList)
}

/**
 * Get the code from the store based on the specified language and section.
 *
 * @param store - The store object.
 * @param language - The language of the code.
 * @param forceAlgo - Force retrieving algorithm code.
 * @returns - The code from the store.
 */
export function getCodeStore(store: TStore, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS', forceAlgo = false) {
  return store[
    forceAlgo
      ? ('algorithm' as TStoreCodeKey)
      : (`${store.section[0]}${language !== 'ALGORITHM' ? language : ''}` as TStoreCodeKey)
  ]
}

/**
 * Get the code completion list for algorithmic expressions and functions.
 *
 * @returns - The list of algorithm code completions.
 */
export function getAlgoCompletionList(): Completion[] {
  const main: Completion[] = [
    {
      label: 'condition: a;',
    },
    {
      info: 'Returns 1.0 if a and b are equal. Otherwise, it returns 0.0. \n\nExample: \nif(eq($a, $b), "Red", "Green"); \nReturns Red if $a=$b, and Green otherwise.',
      label: 'eq(a, b)',
    },
    {
      info: 'Returns 1.0 if a is greater than or equal to b. Otherwise, it returns 0.0. \n\nExample: \nif(ge($a, $b), "Red", "Green"); \nReturns Red if $a>=$b, and Green otherwise.',
      label: 'ge(a, b)',
    },
    {
      info: 'Returns 1.0 if a is less than or equal to b. Otherwise, it returns 0.0. \n\nExample: \nif(le($a, $b), "Red", "Green"); \nReturns Red if $a<=$b, and Green otherwise.',
      label: 'le(a, b)',
    },
    {
      info: 'Returns 1.0 if a and b are not equal. Otherwise, it returns 0.0. \n\nExample: \nif(ne($a, $b), "Red", "Green"); \nReturns Red if $a and $b are not equal, and Green otherwise.',
      label: 'ne(a, b)',
    },
    {
      info: 'Returns factorial n. \n\nExample: \nfact(4); \nReturns 24',
      label: 'fact(n)',
    },
    {
      info: 'Returns a string that expresses the fraction a/b in its lowest terms. \n\nExample: \nfrac(12, 15); \nReturns 4/5 \n\nExample: \nfrac(12, 3); \nReturns 4 \n\nTIP: frac(a,b) can be combined with mathml(s) to produce nicely typeset fractions.',
      label: 'frac(a, b)',
    },
    {
      info: 'Returns the greatest common divisor of a and b. \n\nExample: \ngcd(12, 15); \nReturns 3',
      label: 'gcd(a, b)',
    },
    {
      info: 'Returns 1.0 if a is greater than b (a > b). Otherwise, it returns 0.0. \n\nExample: \ngt(5, 2); \nReturns 1 \n\nExample: \ngt(2, 5); \nReturns 0 \n\nExample: \ngt(5, 5); \nReturns 0',
      label: 'gt(a, b)',
    },
    {
      info: 'Returns 1.0 if a is less than b (a < b). Otherwise, it returns 0.0. \n\nExample: \nlt(2, 5); \nReturns 1 \n\nExample: \nlt(5, 2); \nReturns 0 \n\nExample: \nlt(5, 5); \nReturns 0',
      label: 'lt(a, b)',
    },
    {
      info: 'If a is nonzero, it returns b. Otherwise, it returns c. \n\nExample: \nif(2, 4, 6); \nReturns 4 \n\nExample: \nif(0, 4, 6); \nReturns 6',
      label: 'if(a, b, c)',
    },
    {
      info: 'Returns the index of an item within a list based on the position stated by k (the first item is in position 0, the second in position 1, and so on). \n\nExample: \nindexof(3, 2, 3, 5, 7, 11); \nReturns 1 (because 3 is in position 1 of the list)',
      label: 'indexof(k, a, b, c, d, ...)',
    },
    {
      info: 'Passes the arguments a,b,c,d,.. to a custom Java™ evaluation engine and return the result. \n\nExample: \njava("com.mycompany.QuoteFunction", "AAPL") \nReturns a real-time quote for Apple Inc. stock (assuming that the class QuoteFunction had been suitably programmed).',
      label: 'java(cn, a, b, c, d, ...)',
    },
    {
      info: 'The least significant unit of x in the nth place. \n\nExample: \nlsu(3, 3.14159); \nReturns 0.01 (the unit in the third significant place). \n\nTIP: This operation is designed to be used when setting the tolerance for correct answers.',
      label: 'lsu(n, x)',
    },
    {
      info: 'Passes a string to the Maple™ kernel and returns the value of the last Maple™ line that was processed. \n\nExample: \nmaple("ithprime(12)"); \nReturns 37 (the 12th prime number) \n\nExample: \nmaple("diff(sin(x)*x, x)"); \nReturns cos(x)*x + sin(x)(the derivative of sin(x)*x with respect to x) \n\nExample: \nmaple("MapleTA:-Builtin:-decimal(1, 6.56)"); \nReturns 6.6 (rounds the number 6.56 to 1 decimal place). \n\nTIP: Check out Maple syntax from Maplesoft for a comprehensive list of available commands.',
      label: 'maple("...")',
    },
    {
      info: 'Returns a string consisting of the formula f typeset in MathML. \n\nExample: \nmathml("sin(x)"); \nReturns <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>sin</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></math> \n\nExample: \nmathml("frac(1,2)"); \nReturns <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow></math> \n\nTIP: This command is intended for advanced Maple™ users familiar with MathML.',
      label: 'mathml(f)',
    },
    {
      info: 'Returns the largest of the arguments. \n\nExample: \nmax(5, 2, 8, 3); \nReturns 8',
      label: 'max(a, b, c, d, ...)',
    },
    {
      info: 'Returns the smallest of the arguments. \n\nExample: \nmin(5, 2, 8, 3); \nReturns 2',
      label: 'min(a, b, c, d, ...)',
    },
    {
      info: 'Returns 1.0 if a is equal to 0.0. Otherwise, it returns 0.0. \n\nExample: \nnot(1); \nReturns 0 \n\nExample: \nnot(0); \nReturns 1',
      label: 'not(a)',
    },
    {
      info: 'Returns the value of x, formatted according to the template given by the string fmt. \n\nExample: \nnumfmt("#,##0.00", 12345.678); \nReturns 12,345.68',
      label: 'numfmt(fmt, x)',
    },
    {
      info: 'Uses Maple™ plotting features to graphically display data and mathematical expressions as plots. \n\nExample: \nplotmaple("plot(x^2, x=-5..5)"); \nGenerates a plot of the function x^2 over the range -5 to 5.',
      label: 'plotmaple("plotstatement,...")',
    },
    {
      info: 'Returns a random real number between m and n (inclusive). \n\nExample: \nrand(0, 1); \nReturns a random number between 0 and 1.',
      label: 'rand(m, n)',
    },
    {
      info: 'Generates a random integer in the range 1, ..., floor(n) (inclusive). \n\nExample: \nrange(10); \nReturns a random integer between 1 and 10.',
      label: 'range(n)',
    },
    {
      info: 'Generates a random integer in the range m, m+1,..., m+q (inclusive), where q is the floor of n-m. \n\nExample: \nrange(5, 10); \nReturns a random integer between 5 and 10.',
      label: 'range(m, n)',
    },
    {
      info: 'Generates a random integer in the range m, m+k, ..., m+q*k (inclusive), where q is the floor of (n-m)/k. \n\nExample: \nrange(0, 10, 2); \nReturns a random even number between 0 and 10.',
      label: 'range(m, n, k)',
    },
    {
      info: 'Generates a random integer in the range 0, ..., n-1 (inclusive). \n\nExample: \nrint(5); \nReturns a random integer between 0 and 4.',
      label: 'rint(n)',
    },
    {
      info: 'Generates a random integer in the range m, ..., n-1 (inclusive). \n\nExample: \nrint(5, 10); \nReturns a random integer between 5 and 9.',
      label: 'rint(m, n)',
    },
    {
      info: 'Generates a random integer in the range m, m+k, ..., m+q*k (inclusive), where q is the largest integer such that m+q*k<=n-k. \n\nExample: \nrint(0, 10, 2); \nReturns a random even number between 0 and 10.',
      label: 'rint(m, n, k)',
    },
    {
      info: 'Returns the nth largest element item from a list (numbering starts at 1). \n\nExample: \nrank(2, 5, 8, 3, 2, 7); \nReturns the 2nd largest element, which is 7.',
      label: 'rank(n, a, b, c, d, ...)',
    },
    {
      info: 'Returns the integer part of x. \n\nExample: \nint(5.67); \nReturns 5',
      label: 'int(x)',
    },
    {
      info: 'Returns x expressed as a floating-point number rounded to n decimal places through Maple. \n\nExample: \nmaple("MapleTA:-Builtin:-decimal(2, 6.567)"); \nReturns 6.57 (rounds the number 6.567 to 2 decimal places).',
      label: 'maple("MapleTA:-Builtin:-decimal(n, x)")',
    },
    {
      info: 'Returns x expressed as a floating-point number rounded to n significant digits through Maple. \n\nExample: \nmaple("MapleTA:-Builtin:-sig(3, 12345.6789)"); \nReturns 1.23e+04 (rounds the number 12345.6789 to 3 significant digits).',
      label: 'maple("MapleTA:-Builtin:-sig(n, x)")',
    },
    {
      info: 'Standard mathematical functions of x. \n\nExample: \nsin(30); \nReturns the sine of 30 degrees.',
      label: 'sin(x), cos(x), tan(x)',
    },
    {
      info: 'Computes the rth binomial coefficient of degree n. \n\nExample: \nbinomial(5, 2); \nReturns 10 (the number of ways to choose 2 items from a set of 5).',
      label: 'binomial(n, r)',
    },
    {
      info: 'Computes the cumulative probability for a standard normal distribution. \n\nExample: \nmaple("MapleTA[Builtin][erf](1.5)"); \nReturns the cumulative probability for a standard normal distribution with z=1.5.',
      label: 'maple("MapleTA[Builtin][erf](z)")',
    },
    {
      info: 'Returns x modulo p. \n\nExample: \nmaple("MapleTA:-Builtin:-modp(17, 5)"); \nReturns 2 (because 17 modulo 5 is 2).',
      label: 'maple("MapleTA:-Builtin:-modp(x, p)")',
    },
    {
      info: 'Returns the exponential function e^x. \n\nExample: \nexp(2); \nReturns e^2.',
      label: 'exp(x)',
    },
    {
      info: 'Returns the natural logarithm of x. \n\nExample: \nlog(10); \nReturns the natural logarithm of 10.',
      label: 'log(x)',
    },
    {
      info: 'Returns the absolute value of x. \n\nExample: \nabs(-5); \nReturns 5',
      label: 'abs(x)',
    },
    {
      info: 'Returns the square root of x. \n\nExample: \nsqrt(25); \nReturns 5',
      label: 'sqrt(x)',
    },
    {
      info: 'Rounds x to the nearest integer. \n\nExample: \nround(5.67); \nReturns 6',
      label: 'round(x)',
    },
    {
      info: 'Rounds x up to the nearest integer. \n\nExample: \nceil(5.01); \nReturns 6',
      label: 'ceil(x)',
    },
    {
      info: 'Rounds x down to the nearest integer. \n\nExample: \nfloor(5.99); \nReturns 5',
      label: 'floor(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \nsinh(1); \nReturns the hyperbolic sine of 1.',
      label: 'sinh(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \ncosh(1); \nReturns the hyperbolic cosine of 1.',
      label: 'cosh(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \ttanh(1); \nReturns the hyperbolic tangent of 1.',
      label: 'tanh(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \nasin(1); \nReturns the arcsine of 1.',
      label: 'asin(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \nacos(1); \nReturns the arccosine of 1.',
      label: 'acos(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \natan(1); \nReturns the arctangent of 1.',
      label: 'atan(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \nsindeg(30); \nReturns the sine of 30 degrees.',
      label: 'sindeg(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \ncosdeg(30); \nReturns the cosine of 30 degrees.',
      label: 'cosdeg(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \ntandeg(30); \nReturns the tangent of 30 degrees.',
      label: 'tandeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \nasindef(1); \nReturns the arcsine of 1.',
      label: 'asindeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \nacos(1); \nReturns the arccosine of 1.',
      label: 'acosdeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \natan(1); \nReturns the arctangent of 1.',
      label: 'atandeg(x)',
    },
    {
      info: 'Computes the derivative of f with respect to x. \n\nExample: \nderivative("x^2", "x"); \nReturns 2*x (the derivative of x^2 with respect to x).',
      label: 'derivative(f, x)',
    },
    {
      info: 'Computes the limit of f as x approaches a from the specified direction. \n\nExample: \nlimit("1/x", "x", 0, "right"); \nReturns +infinity (the limit of 1/x as x approaches 0 from the right).',
      label: 'limit(f, x, a, direction)',
    },
    {
      info: 'Solves the equation for the specified variable. \n\nExample: \nsolve("x^2 - 4 = 0", "x"); \nReturns [-2, 2] (the solutions to the equation x^2 - 4 = 0).',
      label: 'solve(equation, variable)',
    },
    {
      info: 'Computes the sum of expr as var ranges from start to end. \n\nExample: \nsum("x^2", "x", 1, 3); \nReturns 14 (the sum of x^2 as x ranges from 1 to 3).',
      label: 'sum(expr, var, start, end)',
    },
    {
      info: 'Computes the product of expr as var ranges from start to end. \n\nExample: \nproduct("x", "x", 1, 3); \nReturns 6 (the product of x as x ranges from 1 to 3).',
      label: 'product(expr, var, start, end)',
    },
    {
      info: 'Computes the definite integral of expr with respect to var from start to end. \n\nExample: \nintegral("x^2", "x", 0, 1); \nReturns 1/3 (the definite integral of x^2 with respect to x from 0 to 1).',
      label: 'integral(expr, var, start, end)',
    },
  ].map((val) => ({ ...val, section: 'Function', type: 'function' }))
  const extra: Completion[] = [
    snippetCompletion('condition: ${x};', { label: 'condition: x;' }),
    snippetCompletion('$${variable} = "${string}";', {
      label: '$variable = "string";',
      section: 'Declaration',
    }),
    snippetCompletion('$${variable} = ${number};', { label: '$variable = number;', section: 'Declaration' }),
    ...main.map((elem) =>
      snippetCompletion('$${variable} = ' + `${elem.label};`, {
        ...elem,
        label: `$variable = ${elem.label};`,
        section: 'Declaration',
      }),
    ),
  ]

  return [...main, ...extra]
}
