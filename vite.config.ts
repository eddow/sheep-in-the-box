import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { readFileSync } from 'fs';

const config: UserConfig = {
	server: {
		https: {
            key: readFileSync(`${__dirname}/certs/local.dev-key.pem`),
            cert: readFileSync(`${__dirname}/certs/local.dev.pem`)
		},
		host: 'local.dev',
		proxy: {},
		fs: {
			allow: ['./dist', '../svemantic']
		}
	},
	plugins: [sveltekit()]
};

export default config;
