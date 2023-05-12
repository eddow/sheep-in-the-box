import { Article, ArticleText, ArticleImage, type ReadArticle } from "../entities/article";
import { type Language, type ArticleType, articleTypes } from '$sitb/constants';
import em from "./db";
import { save, load, remove } from './raw';
import { error } from "@sveltejs/kit";
import { serialize, wrap } from "@mikro-orm/core";

export interface ArticleEdition {
	slug: string;
	type: ArticleType;
	texts: {lng: Language, title: string, text: string}[];
	images: string[];
}

const
	articles = em.getRepository(Article),
	texts = em.getRepository(ArticleText),
	images = em.getRepository(ArticleImage);

function recurLinks<T = string|any[]|object>(text: T, list: Article[], unit: (parm: string)=> string|undefined): T {
	if(typeof text === 'string')
		return <T>text.replace(/="\/([^\/"]*)/g, (all, parm)=> {
			const rv = unit(parm);
			return rv ? `="/${rv}` : all;
		});
	if(Array.isArray(text))
		return <T>text.map(t => recurLinks(t, list, unit));
	return Object.entries(<object>text).reduce((rv: any, [k,v])=> ({
		...rv, [k]: recurLinks(v, list, unit)
	}), {});
}

async function namedLinks<T = string|any[]|object>(text: T): Promise<T> {
	const list = await articles.findAll();
	return recurLinks(text, list, (parm: string)=> list!.find(({_id})=> _id.toString() === parm)?.slug);
}

async function idedLinks<T = string|any[]|object>(text: T): Promise<T> {
	const list = await articles.findAll();
	return recurLinks(text, list, (parm: string)=> list!.find(({slug})=> slug === parm)?._id.toString());
}

export interface ListedArticle {
	slug: string
	type: ArticleType
	images: string[]
	titles: Partial<Record<Language, string>>
}
export async function listArticles(): Promise<ListedArticle[]> {
	return (<Article[]>//<unknown>serialize(
		await articles.find({type: {$in: Object.keys(articleTypes)}}, {populate: ['texts.lng', 'texts.title', 'images']})
	).map((article)=> ({
		slug: article.slug,
		type: article.type,
		images: article.images.toArray().map(img => img!.name) ,
		titles: article.texts.toArray().reduce((rv, {lng, title})=> ({...rv, [lng]: title}), {})
	}));
}

export async function createArticle(slug: string, type: ArticleType) {
	return await em.persistAndFlush(articles.create({slug, type}));
}

export async function editArticle(slug: string): Promise<ArticleEdition> {
	const rv = serialize(await articles.findOneOrFail({slug}, {populate: true}), {
		populate: ['texts', 'images'],
		exclude: ['texts.article', 'images.article']
	});
	
	return {
		...rv,
		images: rv.images.map(img => img!.name),
		texts: await namedLinks(rv.texts)
	}
}

export async function setText(slug: string, lng: Language, diff: Record<string, string>) {
	const article = await articles.findOneOrFail({slug});
	await texts.upsert({article: article._id, lng, ...await idedLinks(diff)});
}

export async function getArticle(slug: string, lng: Language, types: ArticleType[]): Promise<ReadArticle> {
	const article = await articles.findOne({slug, type: {$in: types}}, {populate: ['images']})
	if(!article) throw error(404, slug);
	const text = await texts.findOne({article: article._id, lng}, {fields: ['title', 'text']});
	if(!text) throw error(404, slug);
	return {
		slug,
		type: article.type,
		images: article.images.toArray().map(img => img!.name),
		...await namedLinks(serialize(text))
	};
}

export async function deleteArticle(slug: string) {
	const
		article = await articles.findOneOrFail({slug}, {populate: true}),
		hashes = article.images?.getItems().map(img => img.hash);
	return await Promise.all([
		em.removeAndFlush(article),
		hashes ? garbageCollect(hashes) : Promise.resolve()
	]);
}

export async function setArticle(slug: string, diff: any) {
	// TODO? createQueryBulder -> one-liner
	const article = await articles.findOneOrFail({slug});
	wrap(article).assign(diff);
	await em.persistAndFlush(article);
}

async function exists(article: Article, name: string) {
	return !!await images.count({article: article._id, name});
}

async function availName(article: Article, name: string) {
	if(!await exists(article, name)) return name;
	let adder = 2;
	while(await exists(article, name+'-'+adder)) ++adder;
	return name+'-'+adder;
}

export async function saveFile(slug: string, name: string, type: string, content: Uint8Array) {
	const
		hash = await save(type, content),
		names = name.split('.');
	// remove extension
	if(names.length > 1) names.pop();
	
	const article = await articles.findOneOrFail({slug});
	name = await availName(article, names.join('.'));
	await em.persistAndFlush(images.create({article: article._id, name, hash}));
	return name;
}

export async function renameImage(slug: string, name: string, newName: string) {
	const article = await articles.findOneOrFail({slug});
	if(await exists(article, newName)) throw error(400, 'Name already exists');
	const img = await images.findOneOrFail({article: article._id, name});
	img.name = newName;
	await em.persistAndFlush(img);
}

export async function loadFile(slug: string, name: string, cachedHash: string, trf?: [number, number?]) {
	// TODO check access
	const article = await articles.findOneOrFail({slug});
	const img = await images.findOneOrFail({article: article._id, name});
	if(img.hash === cachedHash) return true;
	return load(img.hash, trf);
}

export async function deleteImg(slug: string, name: string) {
	const article = await articles.findOneOrFail({slug});
	const img = await images.findOneOrFail({article: article._id, name});
	await Promise.all([
		em.removeAndFlush(img),
		garbageCollect([img.hash])
	]);
}
export type ImageSpec = {slug: string, name: string};
export async function copyImg(src: ImageSpec, dst: ImageSpec) {
	const objs = await Promise.all([articles.findOneOrFail({slug: src.slug}), articles.findOneOrFail({slug: dst.slug})]);
	const already = await images.count({article: objs[1]._id, name: dst.name});
	if(already) throw error(400, 'Image already exists');
	const img = await images.findOneOrFail({article: objs[0]._id, name: src.name});
	await em.persistAndFlush(images.create({article: objs[1]._id, name: dst.name, hash: img.hash}));
}

async function garbageCollect(hashes: string[]) {
	const imgs = await images.find({hash: {$in: hashes}}, {fields: ['hash']});
	const found = new Set<string>(imgs.map(img => img.hash));
	await remove(hashes.filter(hash => !found.has(hash)));
}