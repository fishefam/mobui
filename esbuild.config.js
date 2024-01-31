import autoprefixer from 'autoprefixer'
import clean from 'esbuild-plugin-clean'
import style from 'esbuild-style-plugin'
import { readdirSync, readFileSync } from 'fs'
import tailwindcss from 'tailwindcss'

/**
 * Array of file names to be processed.
 * @type {string[]}
 */
const FILES = ['interceptor.ts', 'react/main.tsx']

/**
 * Array of target browsers for the build.
 * @type {string[]}
 */
const BROWSERS = ['chromium', 'firefox']

/**
 * Path to the manifest files.
 * @type {string}
 */
const MANIFEST_PATH = 'manifest/v'

const ASSET_PATHS = ['asset']

/**
 * Represents the base build configuration for esbuild.
 * @type {import('esbuild').BuildOptions}
 */
export const baseConfigs = {
  bundle: true,
  entryPoints: createEntries(BROWSERS, FILES, MANIFEST_PATH, ASSET_PATHS),
  jsx: 'transform',
  loader: { '.asset': 'copy', '.json': 'copy' },
  logLevel: 'info',
  outdir: 'dist',
  plugins: [clean({ patterns: 'dist' }), style({ postcss: { plugins: [autoprefixer(), tailwindcss()] } })],
}

/**
 * Creates an array of input and output paths for each browser and file.
 * @param {string[]} browsers - Array of target browsers.
 * @param {string[]} files - Array of file names to be processed.
 * @param {string} manifestPath - Path to the manifest files.
 * @param {string[]} assetPaths - Path to the copying files.
 * @returns {Array<{in: string, out: string}>} Array of input and output paths.
 */
function createEntries(browsers, files, manifestPath, assetPaths) {
  const entries = browsers
    .map((browser) => files.map((file) => ({ in: file, out: `${browser}/${getFilename(file)}` })))
    .flat()
  const manifests = browsers.map((browser) => ({
    in: `${manifestPath}${browser === 'chromium' ? 3 : 2}.json`,
    out: `${browser}/manifest`,
  }))
  const assetFiles = assetPaths.map((p) => readdirSyncResursive('src/' + p)).flat()
  const copyingFiles = assetFiles
    .map((file) =>
      browsers.map((browser) => ({
        in: file.replace('src/', ''),
        out: `${browser}/${file.replace(/\.asset|src\/|\.\w+$/g, '')}`,
      })),
    )
    .flat()
  return [...entries, ...manifests, ...copyingFiles]
}

/**
 * Extracts the filename from the full path.
 * @param {string} file - Full path of the file.
 * @returns {string} Extracted filename.
 */
function getFilename(file) {
  return file.replace(/(.*\/)|(\.tsx*$)/g, '')
}

/**
 * Description
 * @param {string} root
 * @returns {string[]}
 */
function readdirSyncResursive(root) {
  const _root = root.replace(/^\/|\/$/g, '')
  const files = []
  const dirs = []
  const filesInDir = readdirSync(_root)
  for (const file of filesInDir)
    try {
      const path = `${_root}/${file}`
      readFileSync(path)
      files.push(path)
    } catch {
      const path = `${_root}/${file}`
      dirs.push(path)
    }
  for (const dir of dirs) files.push(...readdirSyncResursive(dir))
  return files
}
