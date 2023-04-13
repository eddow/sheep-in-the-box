import Article, { ArticleKey, type Language, type ArticleType, ArticleImage } from "./objects/article";
import { map } from "./db";
import { save, load } from './raw';
import { error } from "@sveltejs/kit";

const content = map(Article);
const keys = map(ArticleKey);
const imgs = map(ArticleImage);

export async function getArticle(name: string, lng: Language, sys: boolean = false) {
	const system = sys ? [] :
		[{$lookup: {from: 'articlekeys', localField: 'name', foreignField: 'name', as: 'lngs', pipeline: [
			{$match: {type: {$nin: ['rsrvd'/*, 'sys'*/]}}}
		]}}];
	return (await content.aggregate([
		{$match: {name, lng}},
		...system,
		{$project: {_id: 0, title: 1, text: 1}}
	]))[0];
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

export async function setText(name: string, lng: Language, diff: Record<string, string>) {
	await content.updateMany({name, lng}, {$set: diff}, {upsert: true});
}

async function exists(article: string, name: string) {
	return !!await imgs.findOne({article, name});
}

async function availName(article, name) {
	if(!await exists(article, name)) return name;
	let adder = 2;
	while(await exists(article, name+'-'+adder)) ++adder;
	return name+'-'+adder;
}

export async function saveFile(article: string, name: string, type: string, content: Uint8Array) {
	const
		hash = await save(type, content),
		ts = Date.now(),
		names = name.split('.');
	if(names.length > 1) names.pop();	// remove extension
	name = await availName(article, names.join('.'));
	await imgs.updateMany({article, name}, {$set: {hash, ts}}, {upsert: true});
	return name;
}

export async function renameImage(article: string, name: string, newName: string) {
	if(await exists(article, newName)) throw error(400, 'Already exists');
	await imgs.updateMany({article, name}, {$set: {name: newName}});
}

export async function loadFile(article: string, name: string, cachedHash: string) {
	// TODO check access
	const img = await imgs.findOne({article, name});
	if(!img) return null;
	if(img.hash === cachedHash) return true;
	return load(img.hash)
}

export async function listFiles(article: string) {
	const lst = await imgs.aggregate([
		{$match: {article}},
		{$project: {_id: 0, name: 1}},
	]);
	return lst.map(x=> x.name);
}

// TODO garbage collector
export async function deleteImg(article: string, name: string) {
	let newName = await availName('', name);
	const ts = Date.now();
	await imgs.updateMany({article, name}, {$set: {article: '', name: newName, ts}});
}