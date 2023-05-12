import { type Language, type ArticleType, articleTypes } from '$sitb/constants';
import { Cascade, Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../base';

@Entity()
export class Article extends BaseEntity {
	@Property({unique: true, type: ()=> String})
	slug!: string

	@Enum({type: ()=> String, items: Object.keys(articleTypes)})
	type!: ArticleType

	@OneToMany({entity: ()=> ArticleText, mappedBy: 'article', cascade: [Cascade.ALL]})
	texts!: Collection<ArticleText>
	@OneToMany({entity: ()=> ArticleImage, mappedBy: 'article', cascade: [Cascade.ALL]})
	images!: Collection<ArticleImage>
}

@Entity()
@Unique({properties: ['article', 'lng']})
export class ArticleText extends BaseEntity {
	@ManyToOne({entity: ()=> Article, index: true})
	article!: Article

	@Property({type: ()=> String})
	lng!: Language

	@Property({type: ()=> String})
	title!: string

	@Property({type: ()=> String})
	text!: string

	@Property({type: ()=> Number, onUpdate: Date.now})
	ts!: number;
}

@Entity()
@Unique({properties: ['article', 'name']})
export class ArticleImage extends BaseEntity {
	@ManyToOne({entity: ()=> Article, index: true})
	article!: Article

	@Property({type: ()=> String})
	name!: string

	@Property({type: ()=> String})
	hash!: string
}

export interface ReadArticle {
	slug: string
	type: ArticleType
	title: string
	text: string
	images: string[]
}