import { languages, type Language, type Role, roles } from '$sitb/constants';
import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export default class User extends BaseEntity {
	@Property({unique: true})
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
	@Property({unique: true})
	email!: string;
	
	@Property({unique: true})
	code!: string;

	@Property({ onUpdate: Date.now })
	ts!: number;
}

@Entity()
export class UserSession extends BaseEntity {
	@ManyToOne()
	user!: User
	
	@Property({unique: true})
	authKey!: string;

	@Property({ onUpdate: Date.now })
	ts!: number;
}