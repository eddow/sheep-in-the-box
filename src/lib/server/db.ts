import { getModelForClass } from '@typegoose/typegoose';
import type { IModelOptions } from '@typegoose/typegoose/lib/types';
import { connect } from 'mongoose';
import { MONGO_URI }  from "$env/static/private";

await connect(MONGO_URI!);

export function map(definition: any/*AnyParamConstructor<any>*/, parms?: IModelOptions) {
	return getModelForClass(definition, parms);
}

export function removeIds(obj: any) {
	if(obj instanceof Array)
		for(const o of obj) removeIds(o);
	else {
		delete obj._id;
		delete obj.__v;
	}
	return obj;
}