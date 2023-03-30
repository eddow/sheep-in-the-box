
export const assertNnull = <T>(v: T, msg: string): T => {
	console.assert(!!v, msg);
	return v;
};

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

// INTL

export function addTree(dst: any, src: any, prefix?: string) {
	for(const sk in src) {
		if(!sk) dst[prefix||''] = src[sk];
		else {
			const key = prefix? prefix+'.'+sk : sk;
			if(typeof src[sk] === 'string') dst[key] = src[sk];
			else addTree(dst, src[sk], key);
		}
	}
}

export function camel2dot(str: string) {
	const rex = /[A-Z]/;
	let match: RegExpExecArray | null;
	while(match = rex.exec(str))
		str = str.substring(0, match.index) + '.' + match[0].toLowerCase() + str.substring(match.index+1);
	return str;
}