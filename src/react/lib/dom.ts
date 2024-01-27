import { TObject } from 'type/common'

/**
 * Type for options when creating an HTML element.
 */
type TCreateElementOptions<T> = {
  attributes?: Array<[string, string]>
  classnames?: string[]
  innerHtml?: string
  parent?: Element | string
  tag: T
  text?: string
}

/**
 * Selects an HTML element using the provided selector.
 * @param selector - The CSS selector used to select the HTML element.
 * @returns The selected HTML element.
 */
export function selectElement<T extends HTMLElement>(selector: string): T {
  return document.querySelector(selector) as T
}

/**
 * Creates an HTML element based on the provided options.
 * @param options - The options for creating the HTML element.
 * @returns The created HTML element.
 */
export function createElement<T extends keyof HTMLElementTagNameMap>(
  options: TCreateElementOptions<T>,
): HTMLElement {
  const { attributes, classnames, innerHtml, parent, tag, text } = options
  const element = document.createElement(tag)
  if (innerHtml) element.innerHTML = innerHtml
  if (!innerHtml && text) element.textContent = text
  if (attributes) attributes.forEach(([key, value]) => element.setAttribute(key, value))
  if (classnames) element.className = classnames.join(' ')
  if (typeof parent === 'string') document.querySelector(parent)?.appendChild(element)
  if (parent instanceof Element) parent.appendChild(element)
  return element
}

/**
 * Parses HTML string and returns the parsed DOM.
 * @param html - The HTML string to parse.
 * @returns The parsed DOM.
 */
export function parseHTML(html: string): HTMLElement {
  return new DOMParser().parseFromString(html, 'text/html').body
}

/**
 * Extracts attributes, class name, and ID from a NamedNodeMap.
 * @param nodeMap - The NamedNodeMap containing attributes.
 * @returns Object with attributes, class name, and ID.
 */
export function getAttributes(
  nodeMap?: NamedNodeMap,
): { attributes: TObject<string, string>; className?: string; id: string } | undefined {
  const result = {} as TObject<string, string>
  if (nodeMap) Array.from(nodeMap).forEach(({ name, value }) => (result[name] = value))
  const className = result.class.slice()
  const id = result.id.slice()
  delete result.id
  delete result.class
  return Object.keys(result).length > 0 ? { attributes: result, className, id } : undefined
}
