import adapter from '@sveltejs/adapter-auto';
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin";
import noduleLoader from './src/sitb/rollup/nodules.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), vitePreprocess],
	compilerOptions: {
		enableSourcemap: true,
	},
	plugins: [
		noduleLoader('menu', '+menu.svelte'),
		...(process.env.VERCEL ? [] : [
			nodeLoaderPlugin()
		])
	],
	kit: process.env.VERCEL ? {
		adapter: adapter(),
		alias: {
			$sitb: './src/sitb',
			$entities: './src/entities'
		}
	} : {
		adapter: adapter(),
		alias: {
			$svemantic: './src/svemantic',
			svemantic: './src/svemantic',
			$sitb: './src/sitb',
			$entities: './src/entities'
		}
	}
};

export default config;
