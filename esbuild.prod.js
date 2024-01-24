import esbuild from 'esbuild'

import { baseConfigs } from './esbuild.config.js'

/**
 * Build the project using the configured esbuild context.
 * @param {import('esbuild').BuildContext} context - The esbuild build context.
 */
esbuild.build({
  ...baseConfigs,
  minify: true,
  treeShaking: true,
})
