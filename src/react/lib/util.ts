import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
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

export function toStartCase(input: string) {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
    .join(' ')
}

export function getLocalStorageItem(key: TLocalStorageKey) {
  return localStorage.getItem(key) ?? ''
}
