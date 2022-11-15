import Intl, { type Language } from "$lib/server/objects/intl";
import { map } from "./db";

const dictionary = map(Intl);

export async function tree(language: Language, roles: string[]) {
	const filters = {
		role: {$regex: '^((' + roles.join(')|(') + '))$' },
		key: {$regex: `^([^!@])`},
		lng: language
	},	flat = await dictionary.find(filters).exec(), rv = {};
	for(let trad of flat) {
		let brwsr: any = rv, key = trad.key.split('.'), ok: string = key.shift();
		while(key.length) {
			if(!brwsr[ok])
				brwsr[ok] = {};
			else if('string'=== brwsr[ok])
				brwsr[ok] = {'': brwsr[ok]};
			brwsr = brwsr[ok];
			ok = key.shift()!;
		}
		if(brwsr[ok])	// We assert it's an object // TODO add unique index for key/lng
			brwsr[ok][''] = trad.text;
		else brwsr[ok] = trad.text;
	}
	return rv;
}

export async function getDevDictionary(lng: Language) {
	return (await dictionary.find({lng}).exec())
		.map((o: any)=> ({key: o.key, text: o.text, role: o.role}));
}