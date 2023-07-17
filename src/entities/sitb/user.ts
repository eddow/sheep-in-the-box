import { languages, type Language } from '$sitb/constants';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';
import { TABLE_PREFIX }  from "$env/static/private";

@Entity({tableName: TABLE_PREFIX+'user'})
export class User extends BaseEntity {
	@Property({type: ()=> String, unique: true})
	email!: string;
	
	@Property({type: ()=> String, hidden: true})
	password?: string
	
	@Enum({type: ()=> String, items: Object.keys(languages)})
	language!: Language
	
	@Property({type: ()=> String})
	roles!: string
	
	@Property({type: 'json'})
	preferences!: any
}

@Entity({tableName: TABLE_PREFIX+'user-registration'})
export class UserRegistration extends BaseEntity {
	// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
	@Property({type: ()=> String, unique: true})
	email!: string;
	
	@Property({type: ()=> String, unique: true})
	code!: string;

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}

@Entity({tableName: TABLE_PREFIX+'user-session'})
export class UserSession extends BaseEntity {
	@ManyToOne({entity: ()=> User})
	user!: User
	
	@Property({type: ()=> String, unique: true})
	authKey!: string;

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}