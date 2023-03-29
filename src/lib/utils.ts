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

export function compare(dst: any, src: any): any {
	let rv: any = null;
	function spec(k: string) {
		if(!rv) rv = {};
		rv[k] = dst[k];
	}
	for(const k in dst)
		if(!(k in src) || JSON.stringify(src[k]) !== JSON.stringify(dst[k]))
			spec(k);
	return rv;
}