import { readable } from "svelte/store";
import { ajax } from "./ajax";
import { languages, type Language, type Role } from "./constants";
import { privateStore } from "./stores/privateStore";
import { i18n, i18nField,  } from 'svemantic';
import { addTree, camel2dot } from "./utils";
import globic from "./globic";
import { frwrdReadable } from "./stores/frwrdStore";

interface Dictionary {
	hash: any;
	roles: Role[]
}
let dics: Record<string, Dictionary> = {};
const languageStore = globic(()=> privateStore<Language>());
export const language = frwrdReadable(()=> languageStore.store);

/**
 * 
 * @param lng 
 * @param change If false, just set the language, but don't manage the language-change procedure
 */
export async function setLanguage(lng: Language, change: boolean = true) {
	languageStore.value = lng;
	if(!dics[lng]) dics[lng] = {hash: {}, roles: []};
	dictionary = dics[lng];
	if(change) {
		const rv = await ajax.post({language: lng, roles: dics[lng]?.roles}, '/ego'),
			content = await rv.json();
		if(content) gotTree(content);
		else updateTexts();
	}
}

export let dictionary: Dictionary;
export function resetDictionaries() {
	dics = {};
	dictionary = {hash: {}, roles: []};
}

export function gotTree({tree, roles}: {tree: any, roles: Role[]}) {
	dictionary.roles.push(...roles);
	i18n.set({
		dropdown: tree.dropdown,
		table: tree.table,
		form: tree.form,
		button: tree.cmd,
		code: languages[languageStore.value].code
	});
	addTree(dictionary.hash, tree);
	// TODO Whole tree => .set
	i18n.update(old => Object.assign({}, old, {fld: tree.fld}))
	updateTexts();
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
export const I = readable<translationFunction>(x=> `[${x}]`, (set: (i: translationFunction)=> void)=> {
	updateTexts = ()=> {
		const hash = dictionary.hash;
		function entry(key: string, parms?: any): string {
			if(!key) return '';
			key = camel2dot(key);
			return parmed(hash[key], parms) || `[${key}]`;
		}
		i18nField.set(f=> f ? entry('fld.'+f) : '[no-name]');
		set(entry);
	};
	updateTexts();
	return ()=> { updateTexts = ()=> {}; };
});