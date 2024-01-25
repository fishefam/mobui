import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function bem(block: string, element?: string, modifier?: string) {
  return `${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`
}

export function cn(...classnames: string[]) {
  return twMerge(clsx(classnames))
}
