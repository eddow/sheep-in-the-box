import { languages, textTypes, type Language, type TextType } from '$sitb/constants';
import { Cascade, Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../base';

@Entity()
export class IntlKey extends BaseEntity {
	@Property({type: ()=> String, unique: true})
	key!: string;
	
	@Property({type: ()=> String})
	roles!: string;

	@Enum({type: ()=> String, items: [...textTypes]})
	type!: TextType;
	
	@OneToMany({entity: ()=> Intl, mappedBy: 'key', cascade: [Cascade.ALL]})
	texts!: Collection<Intl>
}

@Entity()
@Unique({properties: ['key', 'lng']})
export class Intl extends BaseEntity {
	@ManyToOne({entity: ()=> IntlKey, index: true})
	key!: IntlKey;
	
	@Enum({type: ()=> String, items: Object.keys(languages)})
	lng!: Language;

	@Property({type: ()=> String})
	text!: string;

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}