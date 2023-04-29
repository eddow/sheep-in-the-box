import { type Language, type ArticleType, articleTypes } from '$sitb/constants';
import { Cascade, Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export class Article extends BaseEntity {
	@Property({unique: true})
	slug!: string

	@Enum({items: Object.keys(articleTypes)})
	type!: ArticleType

	@OneToMany({mappedBy: 'article', cascade: [Cascade.ALL]})
	texts!: Collection<ArticleText>
	@OneToMany({mappedBy: 'article', cascade: [Cascade.ALL]})
	images!: Collection<ArticleImage>
}

@Entity()
@Unique({properties: ['article', 'lng']})
export class ArticleText extends BaseEntity {
	@ManyToOne({index: true})
	article!: Article

	@Property()
	lng!: Language

	@Property()
	title!: string

	@Property()
	text!: string

	@Property({ onUpdate: Date.now })
	ts!: number;
}

@Entity()
@Unique({properties: ['article', 'name']})
export class ArticleImage extends BaseEntity {
	@ManyToOne()
	article!: Article

	@Property()
	name!: string

	@Property()
	hash!: string
}

export interface ReadArticle {
	slug: string
	type: ArticleType
	title: string
	text: string
	images: string[]
}