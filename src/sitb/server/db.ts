import { getModelForClass } from '@typegoose/typegoose';
import type { IModelOptions } from '@typegoose/typegoose/lib/types';
import { connect } from 'mongoose';
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
		let fn = /\/entities\/([^//]*)\.ts$/.exec(id);
		if(!fn) throw 'Dynamically import entities';
		return import(`../entities/${fn[1]}.ts`)
	}
})
// Create the new migrations, then apply them
/*const migrator = orm.getMigrator()
await migrator.createMigration()
await migrator.up()*/

// Export the orm as default
export default <EntityManager>orm.em

await connect(MONGODB_URI!);
/*
export let db: Db;
const client = await MongoClient.connect(MONGODB_URI);
db = client.db('sitb');

export async function ag(col: Collection, pipeline: Document[]): Promise<Document[]> {
	return (await col.aggregate(pipeline)).toArray()
}*/
export function map(definition: any/*AnyParamConstructor<any>*/, parms?: IModelOptions) {
	return getModelForClass(definition, parms);
}

export function stringIds(obj: any) {
	if(obj instanceof Array)
		for(const o of obj) stringIds(o);
	else {
		obj._id = obj._id.toString();
		delete obj.__v;
	}
	return obj;
}