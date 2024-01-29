import esbuild from 'esbuild'

import { baseConfigs } from './esbuild.config.js'

/**
 * Represents the build context configuration for esbuild.
 * @type {import('esbuild').BuildContext}
 */
const context = await esbuild.context({ ...baseConfigs, sourcemap: true })

// Start development server and watch for changes
context.serve()
context.watch()
