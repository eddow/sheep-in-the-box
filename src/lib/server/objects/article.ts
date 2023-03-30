import { prop } from '@typegoose/typegoose';
import { languages, articleTypes, type Language, type ArticleType } from '$sitb/constants';
import { map } from '../db';
export { languages, articleTypes, Language, ArticleType }

export default class Article {
	@prop({type: String, required: true, trim: true})
	name!: string;
	
	@prop({type: String, required: true, trim: true, enum: Object.keys(languages)})
	lng!: Language

	@prop({type: String, trim: true})
	title!: string;

	@prop({type: String, trim: true})
	text!: string;7

	@prop({type: Number})
	ts!: number;
}

let art = map(Article).db.collections.articles;
art.createIndex({ name: 1, lng: 1 }, { unique: true });
art.createIndex({ lng: 1 });

export class ArticleKey {
	@prop({type: String, required: true, unique: true, trim: true})
	name!: string;

	@prop({type: String, enum: Object.keys(articleTypes)})
	type!: ArticleType;

	@prop({type: Number})
	ts!: number;
}

export class ArticleImage {
	@prop({type: String, required: true, trim: true})
	article!: string;

	@prop({type: String, required: true, trim: true})
	name!: string;

	@prop({type: String, enum: Object.keys(articleTypes)})
	md5!: string;
}

/*let img = map(Article).db.collections.articleimages;
img.createIndex({ article: 1, name: 1 }, { unique: true });*/