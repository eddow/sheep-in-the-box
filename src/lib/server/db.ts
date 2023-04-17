import { getModelForClass } from '@typegoose/typegoose';
import type { IModelOptions } from '@typegoose/typegoose/lib/types';
import { connect } from 'mongoose';
//import { Collection, type Document } from "mongodb";
import { MONGODB_URI }  from "$env/static/private";

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