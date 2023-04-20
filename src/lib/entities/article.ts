import type { Language, ArticleType } from '$sitb/constants';
import { Collection, Entity, Enum, Index, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './base';

@Entity()
export class Article extends BaseEntity {
	@Unique()
	@Property()
	slug!: string

	@Enum()
	type!: ArticleType

	@OneToMany({mappedBy: 'article'})
	texts: Collection<ArticleText>
	@OneToMany({mappedBy: 'article'})
	images: Collection<ArticleImage>
}

@Entity()
@Index({properties: ['article']})
@Unique({properties: ['article', 'lng']})
export class ArticleText extends BaseEntity {
	@ManyToOne()
	article!: Article

	@Property()
	lng!: Language

	@Property()
	title!: string

	@Property()
	text!: string
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
