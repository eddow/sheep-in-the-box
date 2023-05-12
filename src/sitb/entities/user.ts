import { languages, type Language, type Role, roles } from '$sitb/constants';
import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export default class User extends BaseEntity {
	@Unique()
	@Property()
	email!: string;
	
	@Property({hidden: true})
	password?: string
	
	@Enum({items: Object.keys(languages)})
	language!: Language
	
	@Property()
	roles!: string
	
	@Property({type: 'json'})
	preferences!: any
}

@Entity()
export class UserRegistration extends BaseEntity {
	// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
	@Unique()
	@Property()
	email!: string;
	
	@Unique()
	@Property()
	code!: string;

	@Property()
	ts!: number;
}

@Entity()
export class UserSession extends BaseEntity {
	@ManyToOne()
	user!: User
	
	@Unique()
	@Property()
	authKey!: string;

	@Property()
	ts!: number;
}