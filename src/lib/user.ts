import { goto } from "$app/navigation";
import type { Role, User } from "./constants";
import { jsonCookies } from "./cookies";
import { ajax } from "./globals";
import { privateStore } from "./privateStore";

export function allGroups(rex: RegExp, hay: string, grpIndex: number) {
	const rv = [];
	let m = rex.exec(hay);
	while(m) {
		rv.push(m[grpIndex]);
		m = rex.exec(hay)
	}
	return rv;
}

export function accessible(routeId: string) {
	for(const group of allGroups(/\/\(@(.*?)\)\//g, routeId, 1))
		if(!userStore.value ||!userStore.value.roles[<Role>group]) {
			console.log('CS-401', `Unauthorized (@${group})`);
			return false;
		}
	return true;
}

let updatePreference = (email: string, name: string, value?: string)=> ajax.patch({name, value}, '/user/ego')
export function setSSRupdatePreference(nup: (email: string, name: string, value?: string)=> any) {
	updatePreference = nup;
}

const egoDelay = 5*1000;
const delays: any = {};
function delay(prop: PropertyKey, cb: ()=> void) {
	if(delays[prop]) clearTimeout(delays[prop]);
	delays[prop] = setTimeout(()=> {
		delete delays[prop];
		cb();
	}, egoDelay);
}

const preferencesStore = privateStore();
export const preferences = preferencesStore.store;
const userPrefs = (preferences: Record<PropertyKey, any>)=> new Proxy(preferences, {
	get(target: any, prop: PropertyKey, receiver: any): any {
		return target[prop];
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any): boolean {
		target[prop] = value;
		delay(prop, ()=> updatePreference(userStore.value.email, prop.toString(), value));	// Note: Nothing is done, it is just expected... to have worked
		return true;
	},
	deleteProperty(target: any, prop: PropertyKey): boolean {
		delete target[prop];
		delay(prop, ()=> updatePreference(userStore.value.email, prop.toString()));
		return true;
	}
}), localPrefs = new Proxy({}, {
	get(target: any, prop: PropertyKey, receiver: any): any {
		return jsonCookies.preferences && jsonCookies.preferences[prop];
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any): boolean {
		const preferences = jsonCookies.preferences || {};
		preferences[prop] = value;
		jsonCookies.preferences = preferences;
		return true;
	},
	deleteProperty(target: any, prop: PropertyKey): boolean {
		delete jsonCookies.preferences;
		return true;
	}
});

function analyseRoles(str?: string) {
	const rv = {adm: false, trad: false, sell: false, dev: false, lgdn: false};
	if(typeof str === 'string') {
		rv.lgdn = true;
		if(str)
			for(const r of str.split(' '))
				if(r in rv)
					rv[<Role>r] = true;
	}
	return rv;
}
const userStore = privateStore<User>();
export const user: SvelteStore<User> = userStore.store;
export function setGlobalUser(userSpec: any, routeId: string | null) {
	userStore.value = userSpec && {
		email: userSpec.email,
		language: userSpec.language,
		preferences: userSpec.preferences,
		roles: analyseRoles(userSpec.roles)
	};
	preferencesStore.value = userSpec ?
		userPrefs(userSpec.preferences || {}) :
		localPrefs;
	if(routeId && !accessible(routeId))
		goto('/');
}