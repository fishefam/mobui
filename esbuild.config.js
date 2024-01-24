import autoprefixer from 'autoprefixer'
import clean from 'esbuild-plugin-clean'
import style from 'esbuild-style-plugin'
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

/**
 * Represents the base build configuration for esbuild.
 * @type {import('esbuild').BuildOptions}
 */
export const baseConfigs = {
  bundle: true,
  entryPoints: createEntries(BROWSERS, FILES, MANIFEST_PATH),
  jsx: 'transform',
  loader: { '.json': 'copy' },
  logLevel: 'info',
  outdir: 'dist',
  plugins: [
    clean({ patterns: 'dist' }),
    style({ postcss: { plugins: [autoprefixer(), tailwindcss()] } }),
  ],
}

/**
 * Creates an array of input and output paths for each browser and file.
 * @param {string[]} browsers - Array of target browsers.
 * @param {string[]} files - Array of file names to be processed.
 * @param {string} manifestPath - Path to the manifest files.
 * @returns {Array<{in: string, out: string}>} Array of input and output paths.
 */
function createEntries(browsers, files, manifestPath) {
  const entries = browsers
    .map((browser) => files.map((file) => ({ in: file, out: `${browser}/${getFilename(file)}` })))
    .flat()
  const manifests = browsers.map((browser) => ({
    in: `${manifestPath}${browser === 'chromium' ? 3 : 2}.json`,
    out: `${browser}/manifest`,
  }))
  return [...entries, ...manifests]
}

/**
 * Extracts the filename from the full path.
 * @param {string} file - Full path of the file.
 * @returns {string} Extracted filename.
 */
function getFilename(file) {
  return file.replace(/(.*\/)|(\.tsx*$)/g, '')
}
