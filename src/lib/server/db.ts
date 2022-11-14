import { getModelForClass } from '@typegoose/typegoose';
import { connect } from 'mongoose';

/*const adapter = new MongoDBAdapter({
  debug: import.meta.env.DEV,
  uri: import.meta.env.VITE_MONGO_URI
});*/
await connect(process.env.MONGO_URI!);

export function map(definition: any/*AnyParamConstructor<any>*/) {
	const model = getModelForClass(definition);
	//console.dir(definition);
	//console.dir(model);
	return model;
}