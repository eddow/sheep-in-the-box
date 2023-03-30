import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({options: {allowMixed: Severity.ALLOW}})
export default class Raw {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	md5!: string;
	
	@prop({type: String, required: true})
	type!: string;
}
