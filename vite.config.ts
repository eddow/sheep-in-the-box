import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { resolve } from "path";

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			allow: ['./dist', '../svemantic', './node_modules']
		}
	}
};

export default config;
