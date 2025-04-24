import { resolve } from 'node:path'
import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['**/*.e2e-spec.ts'],
		globals: true,
		root: './',
		setupFiles: ['./tests/setup-e2e.ts'],
	},
	plugins: [
		tsConfigPaths(),
		swc.vite({
			module: { type: 'es6' },
		}),
	],
	resolve: {
		alias: {
			src: resolve(__dirname, './src'),
		},
	},
})
