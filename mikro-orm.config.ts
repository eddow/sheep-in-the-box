import dotenv from 'dotenv';
import config from './src/sitb/server/config';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });


export default {
	...config(process.env),
	dynamicImportProvider: (id: string) => import(id),
	debug: true
};