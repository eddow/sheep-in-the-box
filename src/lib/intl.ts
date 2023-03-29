import { readable } from "svelte/store";
import { ajax } from "./ajax";
import type { Language, Role } from "./constants";
import { privateStore } from "./privateStore";
import { setLocale } from 'yup';
import type { MessageParams } from 'yup/lib/types';
import { i18n, i18nField } from 'svemantic';

interface Dictionary {
	hash: any;
	roles: Role[]
}
let dics: Record<string, Dictionary> = {};
export const languageStore = privateStore<Language>(),	//A- languageStore.value = ... is used when the dictionarries are managed
	language = languageStore.store;

export async function setLanguage(lng: Language) {		//B- setLanguage is used to manage the directories
	const rv = await ajax.post({language: lng, roles: dictionary.roles}, '/user/ego'),
		content = await rv.json();
	languageStore.value = lng;
	if(content) gotTree(content);
	else updateTexts();
}

export let dictionary: Dictionary;
export function resetDictionaries() {
	dics = {};
	dictionary = {hash: {}, roles: []};
}

language.subscribe((lng: Language)=> {
	if(lng) {
		if(!dics[lng]) dics[lng] = {hash: {}, roles: []};
		dictionary = dics[lng];
	}
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
	// TODO Whole tree => .set
	i18n.update(old => Object.assign({}, old, {fld: tree.fld}))
	updateTexts();
}

function camel2dot(str: string) {
	const rex = /[A-Z]/;
	let match: RegExpExecArray | null;
	while(match = rex.exec(str))
		str = str.substring(0, match.index) + '.' + match[0].toLowerCase() + str.substring(match.index+1);
	return str;
}

export function parmed(str: string, parms?: any): string {
	let rex = /\{([^\$].*?)\}/, match: RegExpExecArray | null;
	if(parms) {	//apply parameters
		while(match = rex.exec(str)) {
			str = str.substring(0, match.index) +
				(parms[match[1]] || `[UNSET: ${match[1]}]`)	+
				str.substring(match.index+match[0].length);
		}
	}
	rex = /\{\$(.*?)\}/; //apply translations
	while(match = rex.exec(str)) {
		str = str.substring(0, match.index) +
			(dictionary.hash[camel2dot(match[1])] || `[${match[1]}]`)	+
			str.substring(match.index+match[0].length);
	}
	return str;
}

let updateTexts = ()=> {}
type translationFunction = (key: string, parms?: any)=> string;
export const I = readable<translationFunction>(x=> `[${x}]`, (set: (t: translationFunction)=> void)=> {
	updateTexts = ()=> {
		const hash = dictionary.hash;
		function entry(key: string, parms?: any): string {
			if(!key) return '';
			key = camel2dot(key);
			return parmed(hash[key], parms) || `[${key}]`;
		}
		i18nField.set(f=> f ? entry('fld.'+f) : '[no-name]');
		set(entry);
		function paramdErr(name: string) {
			return (params: MessageParams)=> entry('err.'+name, params);
		}
		setLocale({
			mixed: {
				//default?: Message;
				default: paramdErr('invalid'),
				required: paramdErr('required')
				/*
				oneOf?: Message<{
					values: any;
				}>;
				notOneOf?: Message<{
					values: any;
				}>;
				notType?: Message;
				defined?: Message;*/
			},
			string: {
				email: paramdErr('email')
				
    /*length?: Message<{
        length: number;
    }>;
    min?: Message<{
        min: number;
    }>;
    max?: Message<{
        max: number;
    }>;
    matches?: Message<{
        regex: RegExp;
    }>;
    url?: Message<{
        regex: RegExp;
    }>;
    uuid?: Message<{
        regex: RegExp;
    }>;
    trim?: Message;
    lowercase?: Message;
    uppercase?: Message;*/
			}
			/*number?: NumberLocale
			date?: DateLocale
			boolean?: BooleanLocale
			object?: ObjectLocale
			array?: ArrayLocale*/
		});
	};
	updateTexts();
	return ()=> { updateTexts = ()=> {}; };
});