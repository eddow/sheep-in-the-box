import { Article, ArticleText, ArticleImage } from "../entities/article";
import type { Language, ArticleType } from '$sitb/constants';
import em from "./db";
import { save, load, remove } from './raw';
import { error } from "@sveltejs/kit";
import { PopulateHint, serialize, wrap } from "@mikro-orm/core";

const
	articles = em.getRepository(Article),
	texts = em.getRepository(ArticleText),
	images = em.getRepository(ArticleImage);

export async function listArticles(lng: Language) {
	return serialize(await articles.findAll());
}

export async function createArticle(slug: string, type: ArticleType) {
	return await em.persistAndFlush(articles.create({slug, type}));
}

export async function editArticle(slug: string) {
	const rv = serialize(await articles.findOneOrFail({slug}, {populate: true}), {
		populate: ['texts', 'images'],
		exclude: ['texts.article', 'images.article']
	});
	console.dir(rv.texts, {depth: 10});
	return {
		...rv,
		images: rv.images.map(img => img.name)
	}
}

export async function setText(slug: string, lng: Language, diff: Record<string, string>) {
	const article = await articles.findOneOrFail({slug});
	await em.upsert(ArticleText, {article: article._id, lng, ...diff});
}

export async function getArticle(slug: string, lng: Language) {
	// TODO check access
	const article = await articles.findOne({slug})
	if(!article) return false;
	const text = await texts.findOne({article: article._id, lng}, {fields: ['title', 'text']});
	return text && serialize(text);
}

export async function deleteArticle(slug: string) {
	const article = await articles.findOneOrFail({slug}, {populate: true}),
		hashes = article.images.getItems().map(img => img.hash);
	return await Promise.all([
		articles.removeAndFlush(article),
		garbageCollect(hashes)
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

async function availName(article, name) {
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
	name = await availName(article._id, names.join('.'));
	await em.persistAndFlush(images.create({article: article._id, name, hash}));
	return name;
}

export async function renameImage(slug: string, name: string, newName: string) {
	const article = await articles.findOneOrFail({slug});
	if(await exists(article, newName)) throw error(400, 'Already exists');
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
		images.removeAndFlush(img),
		garbageCollect([img.hash])
	]);
}

async function garbageCollect(hashes: string[]) {
	const imgs = await images.find({hash: {$in: hashes}}, {fields: ['hash']});
	const found = new Set<string>(imgs.map(img => img.hash));
	await Promise.all(hashes.filter(hash => !found.has(hash)).map(hash => remove(hash)));
}