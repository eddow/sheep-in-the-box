import { prop } from '@typegoose/typegoose';
import { languages, roles, type Language, type Role } from './constants';
export { Role, roles }

interface Roles {
	adm: boolean;
	trad: boolean;
	sell: boolean;
	dev: boolean;
}

export default class User {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	email!: string;
	@prop({type: String, required: true})
	password!: string;
	
	@prop({type: String, required: true, enum: Object.keys(languages)})
	language!: Language
	
	@prop({
		type: String, required: true/*, Simply does nothing
		get: (val: string)=> val.split(',').reduce<Roles>((p: Roles, c: string)=> ({...p, [c]: true}), {
			adm: false,
			trad: false,
			sell: false,
			dev: false
		}),
		set: (val: Roles)=> (<Role[]>Object.keys(val)).filter((r: Role)=> val[r]).join(',')*/
	})
	roles!: string;	//Roles;
}