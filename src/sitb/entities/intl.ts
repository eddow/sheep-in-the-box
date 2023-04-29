import { languages, textTypes, type Language, type TextType } from '$sitb/constants';
import { Cascade, Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export class IntlKey extends BaseEntity {
	@Property({unique: true})
	key!: string;
	
	@Property()
	roles!: string;

	@Enum({items: [...textTypes]})
	type!: TextType;
	
	@OneToMany({mappedBy: 'key', cascade: [Cascade.ALL]})
	texts!: Collection<Intl>
}

@Entity()
@Unique({properties: ['key', 'lng']})
export class Intl extends BaseEntity {
	@ManyToOne({index: true})
	key!: IntlKey;
	
	@Enum({items: Object.keys(languages)})
	lng!: Language;

	@Property()
	text!: string;

	@Property({ onUpdate: Date.now })
	ts!: number;
}