import hash from 'shorthash2'

/**
 * This is a standalone module. It acts as an interceptor on page load
 * and injects React. All functions used in this module must be separate from
 * those used by React.
 */

type TInterceptProps = {
  [key in
    | 'classIdKey'
    | 'dataKey'
    | 'extSwitchKey'
    | 'previewFormElementIdKey'
    | 'previewFormElementIdValue'
    | 'reactElementIdKey'
    | 'reactElementIdValue'
    | 'repoNameKey'
    | 'rootLoaderElementIdKey'
    | 'rootLoaderElementIdValue'
    | 'themeKey'
    | 'uidHashKey'
    | 'uidKey'
    | 'urlKey'
    | 'usernameKey']: string
}
type TPrepareDataProps = TInterceptProps

/* Local storage keys to store information for React app */
const EXT_SWITCH_KEY = 'newInterface' // Special key

const CLASS_ID_KEY = 'classId'
const DATA_KEY = 'data'
const EXT_URL_KEY = 'extURL'
const PREVIEW_FORM_ELEMENT_ID_KEY = 'previewFormContainerId'
const REACT_ELEMENT_ID_KEY = 'reactRootId'
const REPO_NAME_KEY = 'reponame'
const ROOT_LOADER_ELEMENT_ID_KEY = 'rootLoaderId'
const THEME_KEY = 'theme'
const UID_HASH_KEY = 'uidHash' // This is to eleminate the repeating hashing of uid later in React
const UID_KEY = 'uid'
const USERNAME_KEY = 'username'

const PREVIEW_FORM_ELEMENT_ID_VALUE = 'preview-form-container'
const REACT_ELEMENT_ID_VALUE = 'root'
const ROOT_LOADER_ELEMENT_ID_VALUE = 'root-loader'

if (localStorage.getItem(EXT_SWITCH_KEY) === 'off') attachSwitchButton(EXT_SWITCH_KEY)

if (localStorage.getItem(EXT_SWITCH_KEY) !== 'off')
  intercept({
    classIdKey: CLASS_ID_KEY,
    dataKey: DATA_KEY,
    extSwitchKey: EXT_SWITCH_KEY,
    previewFormElementIdKey: PREVIEW_FORM_ELEMENT_ID_KEY,
    previewFormElementIdValue: PREVIEW_FORM_ELEMENT_ID_VALUE,
    reactElementIdKey: REACT_ELEMENT_ID_KEY,
    reactElementIdValue: REACT_ELEMENT_ID_VALUE,
    repoNameKey: REPO_NAME_KEY,
    rootLoaderElementIdKey: ROOT_LOADER_ELEMENT_ID_KEY,
    rootLoaderElementIdValue: ROOT_LOADER_ELEMENT_ID_VALUE,
    themeKey: THEME_KEY,
    uidHashKey: UID_HASH_KEY,
    uidKey: UID_KEY,
    urlKey: EXT_URL_KEY,
    usernameKey: USERNAME_KEY,
  })

function attachSwitchButton(extSwitchKey: string) {
  window.onload = () => {
    const button = document.createElement('button')
    button.style.backgroundColor = '#222'
    button.style.borderRadius = '4px'
    button.style.borderStyle = 'none'
    button.style.boxSizing = 'border-box'
    button.style.color = '#fff'
    button.style.cursor = 'pointer'
    button.style.display = 'inline-block'
    button.style.fontSize = '16px'
    button.style.fontWeight = '700'
    button.style.margin = '0'
    button.style.outline = 'none'
    button.style.overflow = 'hidden'
    button.style.padding = '6px 12px'
    button.style.position = 'absolute'
    button.style.right = '0'
    button.style.textAlign = 'center'
    button.style.zIndex = '9999999'
    button.textContent = 'Modern UI               '
    button.onclick = (event) => {
      event.preventDefault()
      localStorage.setItem(extSwitchKey, 'on')
      location.reload()
    }
    button.classList.add('btn', 'btn-default')
    const footer = document.body.querySelector('.actionsMain.col-md-9.col-md-offset-3')
    if (footer) footer.appendChild(button)
    if (!footer) {
      button.style.position = 'fixed'
      button.style.bottom = '1rem'
      button.style.right = '1rem'
      document.body.prepend(button)
    }
  }
}

async function intercept({
  classIdKey,
  dataKey,
  extSwitchKey,
  previewFormElementIdKey,
  previewFormElementIdValue,
  reactElementIdKey,
  reactElementIdValue,
  repoNameKey,
  rootLoaderElementIdKey,
  rootLoaderElementIdValue,
  themeKey,
  uidHashKey,
  uidKey,
  urlKey,
  usernameKey,
}: TInterceptProps) {
  /** Intercept page load and inject a new HTML template for React */
  window.stop()
  preparePage(reactElementIdValue, previewFormElementIdValue, rootLoaderElementIdValue)
  await prepareData({
    classIdKey,
    dataKey,
    extSwitchKey,
    previewFormElementIdKey,
    previewFormElementIdValue,
    reactElementIdKey,
    reactElementIdValue,
    repoNameKey,
    rootLoaderElementIdKey,
    rootLoaderElementIdValue,
    themeKey,
    uidHashKey,
    uidKey,
    urlKey,
    usernameKey,
  })
  finalize()
}

function preparePage(reactElementId: string, previewFormElementId: string, rootLoaderElementId: string) {
  document.querySelector('html')!.innerHTML = `
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${resolveUrl('main.css')}" /> 
        <link rel="icon" type="image/x-icon" href="${resolveUrl('assets/favicon.ico')}">
    </head>
    <body>
        <div id="${reactElementId}"></div> 
        <div id="${previewFormElementId}"></div>
        <div id="${rootLoaderElementId}" style="position:fixed;height:100vh;width:100vw;display:grid;place-items:center;">
            <style>
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
            </style>
            <svg 
              style="width:2rem;height:2rem;color:rgb(229 231 235);fill:#2563eb;animation:spin 1s linear infinite;" 
              viewBox="0 0 100 101" 
            >
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>
    </body>
  `
}

function finalize() {
  console.clear()
  document.querySelector('#root-loader')?.remove()
  const script = document.createElement('script')
  script.setAttribute('src', resolveUrl('main.js'))
  document.head.appendChild(script)
}

function resolveUrl(path: string): string {
  if (chrome) return chrome.runtime.getURL(path)
  return browser.runtime.getURL(path)
}

async function prepareData({
  classIdKey,
  dataKey,
  extSwitchKey,
  previewFormElementIdKey,
  previewFormElementIdValue,
  reactElementIdKey,
  reactElementIdValue,
  repoNameKey,
  rootLoaderElementIdKey,
  rootLoaderElementIdValue,
  themeKey,
  uidHashKey,
  uidKey,
  urlKey,
  usernameKey,
}: TPrepareDataProps) {
  const response = await fetch(location.href)
  const html = await response.text()
  const dom = new DOMParser().parseFromString(html, 'text/html')
  const forms = dom.forms[1] // Exact index of this form from mobius
  const formData = new FormData(forms)
  const username = extractUsername(dom)
  const data: Record<string, string> = {}
  formData.forEach((val, key) => {
    if (val.toString()) data[key] = val.toString()
  })
  const currentTheme = localStorage.getItem(themeKey)
  const storageItems: [string, string][] = currentTheme
    ? [
        [classIdKey, data.classId ?? ''],
        [dataKey, JSON.stringify(data)],
        [extSwitchKey, 'on'],
        [previewFormElementIdKey, previewFormElementIdValue],
        [reactElementIdKey, reactElementIdValue],
        [repoNameKey, dom.querySelector('#pageName li:first-of-type')?.textContent?.trim() ?? 'Site'],
        [rootLoaderElementIdKey, rootLoaderElementIdValue],
        [themeKey, currentTheme],
        [uidHashKey, hash(data.uid ?? '')],
        [uidKey, data.uid ?? ''],
        [urlKey, resolveUrl('')],
        [usernameKey, username],
      ]
    : [
        [classIdKey, data.classId ?? ''],
        [dataKey, JSON.stringify(data)],
        [extSwitchKey, 'on'],
        [previewFormElementIdKey, previewFormElementIdValue],
        [reactElementIdKey, reactElementIdValue],
        [repoNameKey, dom.querySelector('#pageName li:first-of-type')?.textContent?.trim() ?? 'Site'],
        [rootLoaderElementIdKey, rootLoaderElementIdValue],
        [uidHashKey, hash(data.uid ?? '')],
        [uidKey, data.uid ?? ''],
        [urlKey, resolveUrl('')],
        [usernameKey, username],
      ]
  localStorage.clear()
  for (const [key, value] of storageItems) localStorage.setItem(key, value)
}

function extractUsername({ body }: Document): string {
  const navbarNodes = Array.from(body.querySelector('#top #global .container')?.childNodes ?? [])
  const textNodes = navbarNodes.filter(({ nodeName }) => nodeName === '#text')
  const username = textNodes.map((s) => s.textContent?.replace(/\n|\t|\|/g, '').trim()).filter((s) => s !== '')[0]
  return username ?? ''
}
