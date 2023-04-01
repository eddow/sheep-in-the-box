import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), vitePreprocess],
	compilerOptions: {
		enableSourcemap: true,
	},
	kit: {
		adapter: adapter(),
		alias: {
			$sitb: 'src/lib'
		}
	}
};

export default config;
