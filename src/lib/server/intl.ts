import Intl, { IntlKey, type Language } from "$lib/server/objects/intl";
import { map, removeIds } from "./db";
import type { Role } from "./objects/user";

const dictionary = map(Intl);
const keys = map(IntlKey);

// TODO - later - Cache the dictionary in RAM and reload on trad's `refresh` command
let thisFlat: Record<string, string> = {};
export function t(key: string) {
	return thisFlat.hasOwnProperty(key) ? thisFlat[key] : `[${key}]`;
}
/* Keys:
 *  !unv.productId.... = product [description/name/...] from univers `unv`
 *  @key1.key2... = server-only used translation (emails, ...)
 */
export async function flat(language: Language, roles: string[]): Promise<Record<string, string>> {
	const $match: any = {
		key: {$regex: `^([^!@])`},
		lng: language
	};
	let prePipiline: any[] = [];
	if(!~roles.indexOf('dev')) {	//`dev` have everything, no role filter
		$match.role = {$regex: '^((' + roles.join(')|(') + '))$' };
		prePipiline = [
			{$lookup: {from: 'intlkeys', localField: 'key', foreignField: 'key', as: 'keyDesc'}},
			{$project: {key: 1, lng: 1, text: 1, role: {$first: '$keyDesc.role'}}}
		];
	}
	
	return thisFlat = (await dictionary.aggregate([
		...prePipiline,
		{$match},
		{$project: {key: 1, text: 1}}
	])).reduce((p: any, v: any)=> { p[v.key] = v.text; return p; }, {});
}

export function tree(flat: Record<string, string>) {
	const rv: Record<string, any> = {};
	
	for(let key in flat) {
		let brwsr: Record<string, any> = rv, path = key.split('.'), ok: string = <string>path.shift();
		while(path.length) {
			if(!brwsr[ok])
				brwsr[ok] = {};
			else if('string'=== brwsr[ok])
				brwsr[ok] = {'': brwsr[ok]};
			brwsr = brwsr[ok];
			ok = path.shift()!;
		}
		if(brwsr[ok])	// We assert it's an object, a unique compound key is created
			brwsr[ok][''] = flat[key];
		else brwsr[ok] = flat[key];
	}
	return rv;
}

export async function getDevDictionary(lng: Language) {
	return removeIds(await dictionary.aggregate([
		{$match: {lng}},
		{$lookup: {from: 'intlkeys', localField: 'key', foreignField: 'key', as: 'keyDesc'}},
		{$project: {key: 1, text: 1, role: {$first: '$keyDesc.role'}, template: {$first: '$keyDesc.template'}}},
	]));
}

export async function setTexts(key: string, texts: Record<string, string> /* {language: text} */) {
	const promises: Promise<void>[] = [], ts = Date.now();
	// TODO? Check the key is in intlkeys ?
	for(const lng in texts)
		promises.push(dictionary.updateMany({key, lng}, {$set:{text: texts[lng], ts}}, {upsert: true}).exec());
	await Promise.all(promises);
	return await dictionary.aggregate([{$match: {key, lng: Object.keys(texts)}}]);
}

export async function setRoles(key: string, role: Role) {
	return await keys.findOneAndUpdate({key}, {$set:{role}}).exec();
}

export async function create(lng: Language, key: string, text: string, role: string) {
	return await Promise.all([
		dictionary.insertMany([{lng, key, text, ts: Date.now()}]),
		keys.insertMany([{key, role}])
	]);
}

export async function deleteKey(key: string) {
	return await Promise.all([
		dictionary.deleteMany({key}),
		keys.deleteMany({key})
	]);
}

export async function renameKey(from: string, to: string) {
	if((await await dictionary.aggregate([
		{$match: {key: to}},
		{$count: 'count'}
	]))[0]?.count) return false;
	return await Promise.all([
		dictionary.updateMany({key: from}, {$set:{key: to}}).exec(),
		keys.updateMany({key: from}, {$set:{key: to}}).exec()
	]);
}