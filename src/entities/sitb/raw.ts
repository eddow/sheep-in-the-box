import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';
import { TABLE_PREFIX }  from "$env/static/private";

@Entity({tableName: TABLE_PREFIX+'raw'})
export class Raw extends BaseEntity {
	@Property({type: ()=> String, unique: true})
	hash!: string;
	
	@Property({type: ()=> String})
	type!: string;
}
