import Article, { ArticleKey, type Language, type ArticleType, ArticleImage } from "./objects/article";
import { map } from "./db";
import { save, load } from './raw';

const content = map(Article);
const keys = map(ArticleKey);
const imgs = map(ArticleImage);

export function getArticle(name: string, lng: Language, sys: boolean = false) {
	const system = sys ? [] :
		[{$lookup: {from: 'articlekeys', localField: 'name', foreignField: 'name', as: 'lngs', pipeline: [
			{$match: {type: {$nin: ['rsrvd'/*, 'sys'*/]}}}
		]}}];
	return content.aggregate([
		{$match: {name, lng}},
		...system,
		{$project: {_id: 0, title: 1, text: 1}}
	]);
}

export function listArticles(lng: Language) {
	return keys.aggregate([
		{$match: {type: {$ne: 'rsrvd'}}},
		{$lookup: {from: 'articles', localField: 'name', foreignField: 'name', as: 'lngs'}},
		{$unwind:  {path: '$lngs', preserveNullAndEmptyArrays: true}},
		{$project: {_id: 0, name: 1, type: 1, lng: '$lngs.lng'}},
		{$group: {_id: '$name', type: {$min: '$type'}, lngs: {$push: '$lng'}}},
		{$project: {_id: 0, name: '$_id', type: 1, lngs: 1}},
		{$lookup: {
			from: 'articles', localField: 'name', foreignField: 'name', as: 'titles',
			pipeline: [{$match: {lng}}]
		}},
		{$project: {_id: 0, name: 1, type: 1, lngs: 1, title: '$titles.title'}},
		{$unwind: {path: '$title', preserveNullAndEmptyArrays: true}},
	]);
}

export function listTexts(name: string) {
	return content.aggregate([
		{$match: {name}},
		{$project: {_id: 0, lng: 1, title: 1, text: 1}},
	])
}

export async function setArticle(name: string, type: ArticleType) {
	const ts = Date.now();
	await keys.updateMany({name}, {$set: {type, ts}}, {upsert: true});
}

export async function setText(name: string, lng: Language, title: string, text: string) {
	await content.updateMany({name, lng}, {$set: {title, text}}, {upsert: true});
}

export async function saveFile(article: string, name: string, type: string, content: string) {
	const md5 = await save(type, content);
	// TODO What if article/name existed before ?
	await imgs.updateMany({article, name}, {$set: {md5}}, {upsert: true})
}

export async function loadFile(article: string, name: string) {
	// TODO check access
	const img = await imgs.findOne({article, name});
	return load(img._doc.hash)
}