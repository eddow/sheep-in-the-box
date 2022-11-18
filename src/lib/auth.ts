import {  goto } from "$app/navigation";
import type { Language, Role, Roles } from "./constants";
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
		if(!userStore.value || (group !== 'lgdn' && !userStore.value.roles[<Role>group])) {
			console.log('CS-401', `Unauthorized (@${group})`);
			return false;
		}
	return true;
}

export interface User {
	email: string;
	roles: Roles;
	language: Language;
}

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
		roles: analyseRoles(userSpec.roles)
	};
	if(routeId && !accessible(routeId))
		goto('/');
}