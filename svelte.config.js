import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from "@vavite/node-loader/plugin";

console.dir(process.env);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), vitePreprocess],
	compilerOptions: {
		enableSourcemap: true,
	},
	plugins: [
		nodeLoaderPlugin()
	],
	kit: {
		adapter: adapter(),
		alias: process.env.server === 'vercel' ? {
				$sitb: './src/lib'
			} : {
				$svemantic: './src/svemantic',
				svemantic: './src/svemantic',
				$sitb: './src/lib'
			}
	}
};

export default config;
