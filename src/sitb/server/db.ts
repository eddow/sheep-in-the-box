import { MikroORM } from '@mikro-orm/core'
import config from './config'
import type { EntityManager  } from '@mikro-orm/mongodb';

import { MONGODB_URI }  from "$env/static/private";
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';


// src/lib/database.ts

const orm = await MikroORM.init({
	...config({MONGODB_URI}),
	findOneOrFailHandler(entityName: string, where: any) {
		throw error(404, dev ? `Entity ${entityName} not found for query ${JSON.stringify(where)}` : 'Not found');
	},
	dynamicImportProvider(id: string) {
		let fn = /\/entities\/(.*)\.ts$/.exec(id);
		if(!fn) throw 'Dynamically import entities';
		let sitbed = fn[1].split('/');
		if(sitbed.length === 1)
			return import(`../../entities/${sitbed[0]}.ts`)
		if(sitbed.length === 2 && sitbed[0] === 'sitb')
			return import(`../../entities/sitb/${sitbed[1]}.ts`);
		throw Error(`Unreachable entity: ${fn[1]}`);
	}
})
// Create the new migrations, then apply them
/*const migrator = orm.getMigrator()
await migrator.createMigration()
await migrator.up()*/

// Export the orm as default
export default <EntityManager>orm.em
