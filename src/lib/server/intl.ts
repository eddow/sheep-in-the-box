import Intl, { type Language } from "$lib/server/objects/intl";
import { map } from "./db";
import type { Role } from "./objects/user";

const dictionary = map(Intl);

let thisFlat: Record<string, string> = {};
export function t(key: string) {
	return thisFlat.hasOwnProperty(key) ? thisFlat[key] : `[${key}]`;
}
/* Keys:
 *  !unv.productId.... = product [description/name/...] from univers `unv`
 *  @key1.key2... = server-only used translation (emails, ...)
 */
export async function flat(language: Language, roles: string[]): Promise<Record<string, string>> {
	const filters: any = {
		key: {$regex: `^([^!@])`},
		lng: language
	};
	if(!~roles.indexOf('dev')) filters.role = {$regex: '^((' + roles.join(')|(') + '))$' };	//`dev` have everything, no role filter
	return thisFlat = (await dictionary.find(filters).exec()).reduce((p: any, v: any)=> { p[v.key] = v.text; return p; }, {});
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
		if(brwsr[ok])	// We assert it's an object // TODO add unique index for key/lng
			brwsr[ok][''] = flat[key];
		else brwsr[ok] = flat[key];
	}
	return rv;
}

export async function getDevDictionary(lng: Language) {
	return (await dictionary.find({lng}).exec())
		.map((o: any)=> ({key: o.key, text: o.text, role: o.role}));
}

export async function setTexts(key: string, texts: Record<string, string> /* {language: text} */) {
	const promises: Promise<void>[] = [], ts = Date.now();
	// TODO some translations will have to be translated and their role set
	for(const lng in texts)
		promises.push(dictionary.findOneAndUpdate({key, lng}, {$set:{text: texts[lng], ts}}).exec());
	await Promise.all(promises);
	return await dictionary.find({key, lng: Object.keys(texts)}).exec();
}

export async function setRoles(key: string, role: Role) {
	return await dictionary.updateMany({key}, {$set:{role}}).exec();
}

export async function create(lng: Language, key: string, text: string, role: string) {
	return await dictionary.insertMany([{lng, key, text, role}]);
}

export async function deleteKey(key: string) {
	return await dictionary.deleteMany({key});
}

export async function renameKey(from: string, to: string) {
	if((await dictionary.find({key: to}).exec()).length)
		return false;
	return await dictionary.updateMany({key: from}, {$set:{key: to}}).exec();
}