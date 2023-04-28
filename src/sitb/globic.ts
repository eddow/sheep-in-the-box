const CSR: any = {};

let getGlobic: ()=>any = ()=> CSR;
// Set to `AsyncLocalStorage` in hooks.server.ts
export function setGlobicGetter(getter: ()=>any) { getGlobic = getter; }

function forwardProxy<T extends object = any>(get: ()=> any) {
	return new Proxy<T>(<T>{}, {
		get(target: any, prop: PropertyKey, receiver: any): any {
			const obj = get(), rv = obj[prop];
			return typeof rv === 'function' ? rv.bind(obj) : rv;
		},
		set(target: any, prop: PropertyKey, value: any, receiver: any): boolean {
			get()[prop] = value;
			return true;
		},
		deleteProperty(target: any, prop: PropertyKey): boolean {
			delete get()[prop];
			return true;
		},
		ownKeys(target: any): (string|symbol)[] {
			return Object.keys(get());
		},
		getOwnPropertyDescriptor(target: any, prop: PropertyKey): PropertyDescriptor|undefined {
			return Object.getOwnPropertyDescriptor(get(), prop);
		},
		defineProperty(target: any, prop: PropertyKey, descriptor: PropertyDescriptor): boolean {
			Object.defineProperty(get(), prop, descriptor);
			return true;
		},
		has(target: any, prop: PropertyKey): boolean {
			return prop in get();
		},
		setPrototypeOf(target: any, prototype: any): boolean {
			Object.setPrototypeOf(get(), prototype);
			return true;
		},
		getPrototypeOf(target: any): any {
			return Object.getPrototypeOf(get());
		},
		isExtensible(target: any): boolean {
			return Object.isExtensible(get());
		},
		preventExtensions(target: any): boolean {
			Object.preventExtensions(get());
			return true;
		}
	});
}
/**
 * Create a global object that is unique on the client or in each server' request, though global to all scripts
 * @param cnstr 
 * @param key 
 * @returns 
 */
export default function globic<T extends object>(cnstr: ()=> T, key?: symbol|string): T {
	if(!key) key = Symbol('globic');
	return forwardProxy<T>(()=> {
		const globic = getGlobic();
		if(!(key! in globic)) globic[key!] = cnstr();
		return globic[key!];
	});
}