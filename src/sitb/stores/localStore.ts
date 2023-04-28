import { browser } from "$app/environment";
import globic from "$sitb/globic";
import { writable, type Writable, type StartStopNotifier } from "svelte/store";

const stores = globic<Record<string, Writable<any>>>(()=> ({})),
	fromLS = globic<Record<string, boolean>>(()=> ({}));

function serverStore<T>(key: string, persist: boolean = false, v?: T, start?: StartStopNotifier<T>): Writable<T> {
	if(!stores[key]) stores[key] = writable<T>(v, start);
	return stores[key];
}
function clientStore<T>(key: string, persist: boolean = false, v?: T, start?: StartStopNotifier<T>): Writable<T> {
	if(!stores[key]) {
		let lsv = localStorage.getItem(key);
		if(lsv !== null) v = JSON.parse(lsv);
		const {subscribe, set, update} = writable<T>(v, start);
		stores[key] = {subscribe, set, update };
		subscribe((value: T)=> {
			if(!fromLS[key])
				localStorage.setItem(key, JSON.stringify(value !== undefined ? value : null));
		});
	}
	return stores[key];
}
if(browser) addEventListener('storage', (e: StorageEvent)=> {
	if(e.key && stores[e.key] && !fromLS[e.key]) {
		fromLS[e.key] = true;
		try {
			stores[e.key].set(e.newValue ? JSON.parse(e.newValue) : null);
		} finally {
			delete fromLS[e.key];
		}
	}
});
/**
 * Provide a store mirrored on localStorage.
 * - Value persist on the computer
 * - Subscribers are called when the value is changed from localStorage (other tabs)
 * @note Works seamlessly with server-side rendering
 * @note JSON-able values only
 * 
 * @param key The key to use in localStorage
 * @param persist If true, the given value is used only if non existant in localStorage. `false` is used if persisted somewhere else
 * @param v The initial value
 * @param start The start/stop notifier
 */
export default browser ? clientStore : serverStore;