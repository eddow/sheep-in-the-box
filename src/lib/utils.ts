import { dev } from "$app/environment";

const assertNnull = dev ? <T>(v: T, msg: string): T => {
	console.assert(!!v, msg);
	return v;
} : <T>(v: T)=> v;

export {assertNnull};

export function debugProxy(o: any) {
	return new Proxy(o, {
		set(target: any, prop: string | symbol, value: any, receiver: any) {
			debugger;
			return Reflect.set(target, prop, value, receiver);
		}
	});
}