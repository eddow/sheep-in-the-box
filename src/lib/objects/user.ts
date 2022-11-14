import { prop } from '@typegoose/typegoose';
import { languages, type Language } from './intl';
export type Role = 'adm' | 'trad' | 'sell';
export const roles = ['adm', 'trad', 'sell']

export default class User {
	@prop({type: String, required: true, unique: true, trim: true, validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/})
	email!: string
	
	@prop({type: String, required: true, enum: Object.keys(languages)})
	language!: Language
	
	@prop({type: [String], required: true, enum: Object.keys(roles)})
	roles!: string[]
}