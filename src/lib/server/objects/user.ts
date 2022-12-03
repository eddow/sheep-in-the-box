import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { languages, roles, type Language, type Role } from '../../constants';
export { Role, roles }

@modelOptions({options: {allowMixed: Severity.ALLOW}})
export default class User {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	email!: string;
	
	@prop({type: String, required: true})
	password!: string;
	
	@prop({type: String, required: true, enum: Object.keys(languages)})
	language!: Language
	
	@prop({type: String, required: true})
	roles!: string;	//Roles;
	
	@prop({type: Object})
	preferences!: any;
}

export class Registration {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	email!: string;
	
	@prop({type: String, required: true, unique: true})
	code!: string;

	@prop({type: Number})
	ts!: number;
}

export class Session {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	email!: string;
	
	@prop({type: String, required: true, unique: true})
	authKey!: string;

	@prop({type: Number})
	ts!: number;
}