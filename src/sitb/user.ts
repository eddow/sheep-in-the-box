import { browser } from "$app/environment";
import { roles, type Role, type Roles, type User } from "./constants";
import { jsonCookies } from "./cookies";
import { ajax } from "./ajax";
import { privateStore } from "./stores/privateStore";
import { setPrefOperations, Side } from "./preferences";
import globic from "./globic";
import { frwrdReadable } from "./stores/frwrdStore";

export interface IdCheck {
	email?: string;
	pass?: string;
	gglToken?: string;
}

export function* allGroups(rex: RegExp, hay: string, grpIndex: number) {
	let m = rex.exec(hay);
	while(m) {
		yield m[grpIndex];
		m = rex.exec(hay)
	}
}

export function accessible(routeId: string, roles?: Roles) {
	if(!roles)
		roles = userStore.value?.roles || <Roles>{lgdn: false};
	for(const group of allGroups(/\/\(@(.*?)\)\//g, routeId, 1))
		if(!roles[<Role>group]) {
			console.log('CS-401', `Unauthorized (@${group})`);
			return false;
		}
	return true;
}

interface Delay {
	hndl: NodeJS.Timeout;
	cb: ()=> void;
}
const egoDelay = 5*1000,
	delays: Record<PropertyKey, Delay> = {};
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
function solveAllDelays() {
	for(let [p, d] of Object.entries(delays)) {
		d.cb();
		delete delays[p];
	}
}
if(browser) window.addEventListener('beforeunload', solveAllDelays)

// Used by server/root-loader so that this code works in SSR as well as CS-regular usage
export let persistPreference = (email: string, name: string, value?: string)=> ajax.patch({name, value}, '/ego')
export function setSSPersistPreference(npp: (email: string, name: string, value?: string)=> any) {
	persistPreference = npp;
}
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

export function analyseRoles(rolestr?: string): Roles {
	if(rolestr === undefined)
		return <Roles>{lgdn: false};
	const spec = rolestr.split('|') || [];
	return <Roles>roles.reduce((p, c)=> ({...p, [c]: spec?.includes(c)}), {lgdn: true});
}

const userStore = globic(()=> privateStore<User>());
export const user = frwrdReadable(()=> userStore.store);
export function setGlobalUser(userSpec: any) {
	solveAllDelays();
	userStore.value = userSpec && {
		email: userSpec.email,
		roles: analyseRoles(userSpec.roles) || {}
	};
	if(userSpec)
		setPrefOperations(userPrefs(userSpec.preferences), userSpec.preferences);
	else {
		const localVolatile = Object.create(
			jsonCookies.preferences,
			Object.getOwnPropertyDescriptors(browser && localStorage.preferences || {})
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
}