import { Completion, snippetCompletion } from '@codemirror/autocomplete'
import prettify, { LanguageNames } from '@liquify/prettify'
import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import { TObject } from 'type/common'
import { TLocalStorageKey } from 'type/store'

/**
 * Generates a BEM (Block Element Modifier) class name based on the provided parameters.
 *
 * @param {string} block - The block name (required).
 * @param {string} [element] - The optional element name.
 * @param {string} [modifier] - The optional modifier name.
 * @returns {string} - The generated BEM class name.
 */
export function bem(block: string, element?: string, modifier?: string): string {
  return `${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`
}

/**
 * Generates a random string of the specified size using the characters provided.
 *
 * @param {number} [size=9] - The optional size of the generated string.
 * @returns {string} - The generated random string.
 */
export function nanoid(size: number = 9): string {
  const characterSet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  return customAlphabet(characterSet, size)()
}

/**
 * Merges and applies Tailwind CSS utility classes using the provided class names.
 *
 * @param {ClassValue[]} inputs - Variable number of class names.
 * @returns {string} - Merged and formatted Tailwind CSS utility classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to start case (capitalizing the first letter of each word).
 * @param input - The input string to be converted to start case.
 * @returns The input string converted to start case.
 */
export function toStartCase(input: string): string {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
    .join(' ')
}

/**
 * Retrieves a value from local storage using the provided key.
 * @param key - The key used to identify the value in local storage.
 * @returns The value associated with the provided key in local storage, or an empty string if not found.
 */
export function getLocalStorageItem(key: TLocalStorageKey): string {
  return localStorage.getItem(key) ?? ''
}

/**
 * Checks if an object has specific properties with non-falsy values.
 * @param property - The object to check for properties.
 * @param keys - The list of property keys to check.
 * @returns A boolean indicating whether the object has all specified properties.
 */
export function hasProps<T extends string, U>(keys: T[], property: TObject): property is { [key in T]: U } {
  const checks = keys.map((key) => !!property[key]).filter((v) => !v)
  return checks.length === 0
}

export function hasString<T extends string>(strings: T[], value = ''): value is T {
  return strings.includes(value as T)
}

export function prettier(value: string, cb: (result: string) => void) {
  prettify.format?.(value, { preserveLine: 1, wrap: 100 }).then(cb)
}

export function prettierSync(value: string, language: LanguageNames) {
  return (
    prettify.formatSync?.(value, {
      crlf: false,
      language,
      mode: 'beautify',
      preserveLine: 1,
      style: { quoteConvert: 'double', sortProperties: true, sortSelectors: true },
      wrap: 100,
    }) ?? ''
  )
}

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
    snippetCompletion('import {${names}} from "${module}"\n${}', {
      detail: 'named',
      label: 'import',
      type: 'keyword',
    }),
    snippetCompletion('import ${name} from "${module}"\n${}', {
      detail: 'default',
      label: 'import',
      type: 'keyword',
    }),
  ]

  return snippets.concat(keywords)
}

export function updateCompletionList(html: string, setCompletion: TSetState<Completion[]>) {
  const ids = (html.match(/id="([^"]*)"/gi) ?? []).map((match) => match.replace(/^id="|"$/g, ''))
  const completionList: Completion[] = ids.map((id) =>
    snippetCompletion(`document.querySelector("#${id}")`, {
      label: `select ${id}`,
      type: 'method',
    }),
  )
  setCompletion(completionList)
}
