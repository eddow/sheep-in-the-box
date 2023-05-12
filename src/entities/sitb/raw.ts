import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';

@Entity()
export default class Raw extends BaseEntity {
	@Property({unique: true})
	hash!: string;
	
	@Property()
	type!: string;
}
