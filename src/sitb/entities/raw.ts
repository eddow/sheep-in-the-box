import { type Language, type ArticleType, articleTypes } from '$sitb/constants';
import { Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export default class Raw extends BaseEntity {
	@Unique()
	@Property()
	hash!: string;
	
	@Property()
	type!: string;
}
