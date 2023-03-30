import Intl, { IntlKey, type Language, type TextType } from "./objects/intl";
import { map } from "./db";
import type { Role } from "./objects/user";

const dictionary = map(Intl);
const keys = map(IntlKey);

// TODO - later - Cache the dictionary in RAM and reload on trad's `refresh` command or regularly
let thisFlat: Record<string, string> = {};
export function i(key: string) {
	return key in thisFlat ? thisFlat[key] : `[${key}]`;
}
/* Keys:
 *  !unv.productId.... = product [description/name/...] from univers `unv`
 */
export async function flat(language: Language, roles: string[]): Promise<Record<string, string>> {
	const $match: any = {
		key: {$regex: `^([^!@])`},
		lng: language
	};
	let prePipiline: any[] = [];
	if(!~roles.indexOf('dev')) {	//`dev` have everything, no role filter - perhaps still avoid server-side
		$match.role = {$regex: '^((' + roles.join(')|(') + '))$' };
		prePipiline = [
			{$lookup: {from: 'intlkeys', localField: 'key', foreignField: 'key', as: 'keyDesc'}},
			{$project: {_id: 0, key: 1, lng: 1, text: 1, role: {$first: '$keyDesc.role'}}}
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

export async function getDevDictionary(lng: Language) {
	return await dictionary.aggregate([
		{$match: {lng}},
		{$lookup: {from: 'intlkeys', localField: 'key', foreignField: 'key', as: 'keyDesc'}},
		{$project: {_id: 0, key: 1, text: 1, role: {$first: '$keyDesc.role'}, type: {$first: '$keyDesc.type'}}}
	]);
}

export async function getTradDictionaries(/*lngs: Language[]*/) {
	let rv = await dictionary.aggregate([
		{$group: {_id: '$key', key: {$min: '$key'}, trads: {$addToSet: {lng: '$lng', text: '$text'}}}},
		//{$project: {key: '$key', trads: {$filter: {input: '$trads', as: 'tr', cond: {$in: ['$$tr.lng', lngs]}}}}},
		{$lookup: {from: 'intlkeys', localField: 'key', foreignField: 'key', as: 'keyDesc'}},
		{$project: {_id: 0, key: 1, trads: 1, type: {$first: '$keyDesc.type'}}}
	]);
	/* Too complex in aggregations for me, I keep on is JS
	{
		"key": "role.none",
		"type": "",
		"trads": [{"lng": "fr", "text": "Publique"}, {"lng": "ro", "text": "Public"}]
	} => {
		"key": "role.none",
		"type": "",
		"fr": "Publique",
		"ro": "Public"
	}
	*/
	return rv.map((cplx: any)=> (cplx.trads.reduce((ttl: any, cur: any)=> ({...ttl, [cur.lng]: cur.text}), {key: cplx.key, type: cplx.type})))
}

export async function setTexts(key: string, texts: Record<string, string> /* {language: text} */) {
	const promises: Promise<void>[] = [], ts = Date.now();
	// Check the key exists
	if(!(await await dictionary.aggregate([
		{$match: {key}},
		{$count: 'count'}
	]))[0]?.count) return false;
	for(const lng in texts)
		promises.push(dictionary.updateMany({key, lng}, {$set:{text: texts[lng], ts}}, {upsert: true}));
	await Promise.all(promises);
	return await dictionary.aggregate([{$match: {key, lng: Object.keys(texts)}}]);
}

export async function setKeyInfo(key: string, $set: {role?: Role, type?: TextType}) {
	return await keys.findOneAndUpdate({key}, {$set});
}

export async function create(lng: Language, key: string, text: string, role: string, type: TextType) {
	try { await keys.insertMany([{key, role, type}]) } catch {}
	return (await dictionary.insertMany([{lng, key, text, ts: Date.now()}]))[0]._id;
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
		dictionary.updateMany({key: from}, {$set:{key: to}}),
		keys.updateMany({key: from}, {$set:{key: to}})
	]);
}

export async function getText(key: string, lng: string) {
	return (await dictionary.findOne({key, lng})).text;
}