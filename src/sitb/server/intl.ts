import { Intl, IntlKey } from "$entities/sitb/intl";
import type { Language, TextType } from "$sitb/constants";
import em from "./db";
import type { RequestEvent } from "@sveltejs/kit";
import type { DevDictionaryEntry, TradDictionary } from "$sitb/intl";

const
	dictionary = em.getRepository(Intl),
	keys = em.getRepository(IntlKey);

// TODO - later - Cache the dictionary in RAM and reload on trad's `refresh` command or regularly
export function i(key: string, {locals: {dictionary}}: RequestEvent) {
	return key in dictionary ? dictionary[key] : `[${key}]`;
}

export async function flat(language: Language, roles: string[]): Promise<Record<string, string>> {
	const match: any = {
		lng: language
	};
	if(!~roles.indexOf('dev'))	//`dev` have everything, no role filter - perhaps still avoid server-side
		match.key = {roles: {$regex: '^(.*\|)?((' + roles.join(')|(') + '))(\|.*)?$' }};
	
	const rv = (await dictionary.find(match, {populate: ['key']}));
	return Object.fromEntries(rv.map(({key, text})=> [key.key, text]));
}

export function tree(flat: Record<string, string>) {
	const rv: Record<string, any> = {};

	for(let key in flat) {
		let brwsr: Record<string, any> = rv, path = key.split('.'), ok: string = <string>path.shift();
		while(path.length) {
			if(!brwsr[ok])
				brwsr[ok] = {};
			else if(typeof brwsr[ok] === 'string')
				brwsr[ok] = {'': brwsr[ok]};
			brwsr = brwsr[ok];
			ok = path.shift()!;
		}
		console.assert(typeof brwsr[ok] !== "string", 'Key unicity: '+key);
		if(brwsr[ok])
			brwsr[ok][''] = flat[key];
		else brwsr[ok] = flat[key];
	}
	return rv;
}

export async function getDevDictionary(lng: Language): Promise<DevDictionaryEntry[]> {
	return (await dictionary.find({lng}, {populate: ['key']}))
		.map(e=> ({text: e.text, key: e.key.key, type: e.key.type, roles: e.key.roles}));
}

// TODO: Manage partial dictionary (only some languages)
export async function getTradDictionaries(/*lngs: Language[]*/): Promise<TradDictionary[]>  {
	//const lngs = Object.keys(languages);
	return (await keys.findAll({populate: ['texts']})) //await keys.find({texts: {lng: {$in: lngs}}}, {populate: ['texts']}); - empties
		.map(e=> ({
			key: e.key,
			type: e.type,
			...Object.fromEntries(e.texts.toArray().map(t=> ([t.lng, t.text])))
		}));
}

export async function setTexts(key: string, texts: Record<Language, string>): Promise<void> {
	const promises: Promise<Intl>[] = [];
	// Check the key exists
	const iKey = await keys.findOneOrFail({key});
	for(const lng in texts)
		promises.push(dictionary.upsert({key: iKey._id, lng: <Language>lng, text: texts[<Language>lng]}));
	await Promise.all(promises);
}

export async function setKeyInfo(key: string, diff: Partial<IntlKey>) {
	return await keys.nativeUpdate({key}, diff);
}

export async function create(lng: Language, key: string, text: string, roles: string, type: TextType) {
	const k = await keys.nativeInsert({key, roles, type});
	await dictionary.nativeInsert({key: k, lng, text});
}

export async function deleteKey(key: string) {
	const ik = await(keys.findOneOrFail({key}, {populate: ['texts']}));
	await em.removeAndFlush(ik);
}

export async function getText(key: string, lng: string) {
	return (await dictionary.findOneOrFail({key: {key}, lng})).text;
}