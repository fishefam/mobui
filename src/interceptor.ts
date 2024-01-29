import hash from 'shorthash2'

/**
 * This is a standalone module. It acts as an interceptor on page load
 * and injects React. All functions used in this module must be separate from
 * those used by React.
 */

/* Local storage keys to store information for React app */
const DATA_KEY = 'data'
const EXT_URL_KEY = 'extURL'
const UID_HASH_KEY = 'uidHash' // This is to eleminate the repeating hashing of uid later in React
const CLASS_ID_KEY = 'classId'
const USERNAME_KEY = 'username'
const REPO_NAME_KEY = 'reponame'

main(DATA_KEY, UID_HASH_KEY, USERNAME_KEY, CLASS_ID_KEY, REPO_NAME_KEY, EXT_URL_KEY)

/**
 * Main function that acts as an entry point for the module.
 * It intercepts page load, injects a new HTML template for React,
 * prepares data, and finalizes the process.
 * @param {string} dataKey - The key for storing data in local storage
 * @param {string} uidHashKey - The key for storing UID hash in local storage
 * @param {string} usernameKey - The key for storing username in local storage
 * @param {string} repoNameKey - The key for storing the repository name in local storage
 * @param {string} urlKey - The key for storing the resolved URL in local storage
 */
async function main(
  dataKey: string,
  uidHashKey: string,
  usernameKey: string,
  classIdKey: string,
  repoNameKey: string,
  urlKey: string,
) {
  /** Intercept page load and inject a new HTML template for React */
  window.stop()
  preparePage()
  await prepareData(dataKey, uidHashKey, usernameKey, classIdKey, urlKey, repoNameKey)
  finalize()
}

/**
 * Prepares the page by setting up the HTML structure for React.
 * It includes links to CSS and an SVG loader which will be remove from the DOM
 * after the intercepting process in done.
 */
function preparePage() {
  document.querySelector('html')!.innerHTML = `
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${resolveUrl('main.css')}" /> 
        <link rel="icon" type="image/x-icon" href="${resolveUrl('assets/favicon.ico')}">
    </head>
    <body>
        <div id="root"></div> 
        <div id="root-loader" style="position:fixed;height:100vh;width:100vw;display:grid;place-items:center;">
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

/**
 * Finalizes the process by clearing console, removing the loader,
 * and dynamically adding a script tag for the main JavaScript file (React injection).
 */
function finalize() {
  console.clear()
  document.querySelector('#root-loader')?.remove()
  const script = document.createElement('script')
  script.setAttribute('src', resolveUrl('main.js'))
  document.head.appendChild(script)
}

/**
 * Generates a extensions' resolved URL for a given path.
 * It considers whether the code is running in a Chrome or Firefox browser.
 * @param {string} path - The path to resolve
 * @returns {string} - The resolved URL
 */
function resolveUrl(path: string): string {
  if (chrome) return chrome.runtime.getURL(path)
  return browser.runtime.getURL(path)
}

/**
 * Prepares data by fetching the current page, extracting form data,
 * and storing relevant information in local storage.
 * @param {string} dataKey - The key for storing data in local storage
 * @param {string} uidHashKey - The key for storing UID hash in local storage
 * @param {string} usernameKey - The key for storing username in local storage
 */
async function prepareData(
  dataKey: string,
  uidHashKey: string,
  usernameKey: string,
  classIdKey: string,
  urlKey: string,
  repoNameKey: string,
) {
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
  const storageItems: [string, string][] = [
    [urlKey, resolveUrl('')],
    [usernameKey, username],
    [uidHashKey, hash(data.uid ?? '')],
    [classIdKey, data.classId ?? ''],
    [dataKey, JSON.stringify(data)],
    [repoNameKey, dom.querySelector('#pageName li:first-of-type')?.textContent?.trim() ?? 'Site'],
  ]
  localStorage.clear()
  for (const [key, value] of storageItems) localStorage.setItem(key, value)
}

/**
 * Extracts the username from the document's body.
 * @param {Document} doc - The document object
 * @returns {string} - The extracted username
 */
function extractUsername({ body }: Document): string {
  const navbarNodes = Array.from(body.querySelector('#top #global .container')?.childNodes ?? [])
  const textNodes = navbarNodes.filter(({ nodeName }) => nodeName === '#text')
  const username = textNodes.map((s) => s.textContent?.replace(/\n|\t|\|/g, '').trim()).filter((s) => s !== '')[0]
  return username ?? ''
}
