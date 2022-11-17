import { readable } from "svelte/store";
import { ajax } from "./ajax";
import type { Language, Role } from "./constants";
import { privateStore } from "./privateStore";

interface Dictionary {
	tree: any;
	roles: Role[]
}
let dics: Record<string, Dictionary> = {};
export const languageStore = privateStore<Language>(),
	language = languageStore.store;
export let dictionary: Dictionary;
export function resetDictionaries() {
	dics = {};
	dictionary = {tree: {}, roles: []};
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
		dics[lng] = {tree: {}, roles: []};
	dictionary = dics[lng];
});

function addTree(dst: any, src: any) {
	for(let sk in src) {
		if(!dst[sk]) dst[sk] = src[sk];
		else {
			const [mbs, subt] = typeof src[sk] === 'string' ? [src[sk], dst[sk]] : [dst[sk], src[sk]];
			if(typeof subt !== 'string') {
				if(typeof mbs === 'string')
					dst[sk] = {...subt, '': mbs};
				else addTree(mbs, subt);
			}
		}
	}
}

export function gotTree({tree, roles}: {tree: any, roles: Role[]}) {
	dictionary.roles.push(...roles);
	addTree(dictionary.tree, tree);
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
			let brwsr = dictionary.tree, keys = key.split('.'), i;
			for(i = 0; i < keys.length && brwsr instanceof Object; ++i)
				brwsr = brwsr[keys[i]];
			if(i >= keys.length && brwsr) {
				let rv = typeof brwsr === 'string' ? brwsr :
					'' in brwsr ? brwsr[''] :
					null;
				if(rv)
					return parmed(rv, parms);
			}
			return `[${key}]`;
		}
		set(entry);
	};
	updateTexts();
	return ()=> { updateTexts = ()=> {}; };
});