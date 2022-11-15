import { getModelForClass } from '@typegoose/typegoose';
import type { IModelOptions } from '@typegoose/typegoose/lib/types';
import { connect } from 'mongoose';
import { MONGO_URI }  from "$env/static/private";

/*const adapter = new MongoDBAdapter({
  debug: import.meta.env.DEV,
  uri: import.meta.env.VITE_MONGO_URI
});*/
await connect(MONGO_URI!);

export function map(definition: any/*AnyParamConstructor<any>*/, parms?: IModelOptions) {
	const model = getModelForClass(definition, parms);
	return model;
}