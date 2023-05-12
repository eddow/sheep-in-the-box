import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';

@Entity()
export class Raw extends BaseEntity {
	@Property({type: ()=> String, unique: true})
	hash!: string;
	
	@Property({type: ()=> String})
	type!: string;
}
