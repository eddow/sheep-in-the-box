import { languages, type Language, type Role, roles } from '$sitb/constants';
import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../base';

@Entity()
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

@Entity()
export class UserRegistration extends BaseEntity {
	// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
	@Property({type: ()=> String, unique: true})
	email!: string;
	
	@Property({type: ()=> String, unique: true})
	code!: string;

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}

@Entity()
export class UserSession extends BaseEntity {
	@ManyToOne({entity: ()=> User})
	user!: User
	
	@Property({type: ()=> String, unique: true})
	authKey!: string;

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}