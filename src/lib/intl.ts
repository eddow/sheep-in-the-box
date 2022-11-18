import { readable } from "svelte/store";
import { ajax } from "./ajax";
import type { Language, Role } from "./constants";
import { privateStore } from "./privateStore";

interface Dictionary {
	hash: any;
	roles: Role[]
}
let dics: Record<string, Dictionary> = {};
export const languageStore = privateStore<Language>(),
	language = languageStore.store;
export let dictionary: Dictionary;
export function resetDictionaries() {
	dics = {};
	dictionary = {hash: {}, roles: []};
}
export async function setLanguage(lng: Language) {
	languageStore.value = lng;
	const rv = await ajax.post({language: lng, roles: dictionary.roles}, '/intl'),
		content = await rv.json();
	if(content) gotTree(content);
	else updateTexts();
}

language.subscribe((lng: Language)=> {
	if(!dics[lng])
		dics[lng] = {hash: {}, roles: []};
	dictionary = dics[lng];
});

function addTree(dst: any, src: any, prefix?: string) {
	for(const sk in src) {
		if(!sk) dst[prefix||''] = src[sk];
		else {
			const key = prefix? prefix+'.'+sk : sk;
			if(typeof src[sk] === 'string') dst[key] = src[sk];
			else addTree(dst, src[sk], key);
		}
	}
}

export function gotTree({tree, roles}: {tree: any, roles: Role[]}) {
	dictionary.roles.push(...roles);
	addTree(dictionary.hash, tree);
	updateTexts();
}

export function parmed(str: string, parms?: any): string {
	if(parms) for(const parm in parms)
		str = str.replaceAll(`{${parm}}`, parms[parm]);
	return str;
}

let updateTexts = ()=> {}
type translationFunction = (key: string, parms?: any)=> string;
export const T = readable<translationFunction>(x=> `[${x}]`, (set: (t: translationFunction)=> void)=> {
	updateTexts = ()=> {
		function entry(key: string, parms?: any): string {
			if(!key) return '';
			return dictionary.hash[key] || `[${key}]`;
		}
		set(entry);
	};
	updateTexts();
	return ()=> { updateTexts = ()=> {}; };
});