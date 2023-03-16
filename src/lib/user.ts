import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import type { Role, Roles, User } from "./constants";
import { jsonCookies } from "./cookies";
import { ajax } from "./globals";
import { privateStore } from "./privateStore";
import { setPrefOperations, Side } from "./preferences";

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
		if(!userStore.value ||!(<Roles>userStore.value.roles)[<Role>group]) {
			console.log('CS-401', `Unauthorized (@${group})`);
			return false;
		}
	return true;
}

// Used by hook.server so that this code works in SSR as well as CS-regular usage
export let persistPreference = (email: string, name: string, value?: string)=> ajax.patch({name, value}, '/user/ego')
export function setSSPersistPreference(npp: (email: string, name: string, value?: string)=> any) {
	persistPreference = npp;
}


const egoDelay = 5*1000,
	delays: any = {};
// onBeforeLeave => call delays
function delay(prop: PropertyKey, cb: ()=> void) {
	if(browser) {
		if(delays[prop]) clearTimeout(delays[prop].hndl);
		delays[prop] = {
			hndl: setTimeout(()=> {
				delete delays[prop];
				cb();
			}, egoDelay),
			cb
		};
	} else cb();
}
if(browser)
	window.addEventListener('beforeunload', (ev: BeforeUnloadEvent)=> {
		for(let p of Object.keys(delays)) {
			delays[p].cb();
			delete delays[p];
		}
	})
const userPrefs = (preferences: Record<PropertyKey, any>)=> ({
		get(prop: string): any {
			return preferences[prop];
		},
		set(side: Side, prop: string, value: string) {
			if(preferences[prop] != value) {
				preferences[prop] = value;
				delay(prop, ()=> persistPreference(userStore.value.email, prop.toString(), value));	// Note: Nothing is done, it is just expected... to have worked
			}
		},
		del(side: Side, prop: string) {
			if(prop in preferences) {
				delete preferences[prop];
				delay(prop, ()=> persistPreference(userStore.value.email, prop.toString()));
			}
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
	if(userSpec)
		setPrefOperations(userPrefs(userSpec.preferences || {}), userSpec.preferences);
	else {
		const localVolatile = Object.create(
			jsonCookies.preferences,
			Object.getOwnPropertyDescriptors(browser ? localStorage.preferences : {})
		);
		function accsLP(side: Side, upd: (lp: any)=> void): any {
			const preferences = side == Side.client ? localVolatile : jsonCookies.preferences || {};
			upd(side == Side.server ? jsonCookies.preferences : preferences);
			if(side == Side.server)
				jsonCookies.preferences = jsonCookies.preferences;
			else if(browser)
				localStorage.preferences = Object.create({}, Object.getOwnPropertyDescriptors(preferences))
		}
		setPrefOperations({
			get(prop: string): any {
				return localVolatile[prop];
			},
			set(side: Side, prop: string, value: string) {
				accsLP(side, preferences=> preferences[prop] = value);
			},
			del(side: Side, prop: string) {
				accsLP(side, preferences=> delete preferences[prop]);
			}
		}, localVolatile);
	}
	if(routeId && !accessible(routeId))
		goto('/');
}