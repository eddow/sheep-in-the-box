import { readable, writable } from "svelte/store";
import type { Language, Role } from "./constants";

interface Dictionary {
	tree: any;
	roles: Role[]
}
let dics: Record<string, Dictionary> = {};
export const language = writable<Language>();
export let dictionary: Dictionary;
export function resetDictionaries() {
	dics = {};
	dictionary = {tree: {}, roles: []};
}
export async function setLanguage(lng: Language) {
	language.set(lng);
	const rv = await fetch('/intl', {
		method: 'POST',
		body: JSON.stringify({language: lng, roles: dictionary.roles})
	}), content = await rv.json();
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

let updateTexts = ()=> {}
export const T = readable<(key: string)=> string>(x=> `[${x}]`, (set: (t: (key: string)=> string)=> void)=> {
	updateTexts = ()=> {
		function entry(key: string) {
			let brwsr = dictionary.tree, keys = key.split('.'), i;
			for(i = 0; i < keys.length && brwsr instanceof Object; ++i)
				brwsr = brwsr[keys[i]];
			if(i >= keys.length) {
				if(typeof brwsr === 'string') return brwsr;
				if(brwsr.hasOwnProperty('')) return brwsr[''];
			}
			return `[${key}]`;
		}
		set(entry);
	};
	updateTexts();
	return ()=> { updateTexts = ()=> {}; };
});