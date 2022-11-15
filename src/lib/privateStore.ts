import { readable, type Subscriber } from "svelte/store";

export function privateStore<T=any>(value: any) {
	let set: Subscriber<T> = ()=> {};
	const rv = {
		store: readable<T>(value, setFct=> {
			set = setFct;
			set(value);
			return ()=> { set = <Subscriber<T>>(()=> {}); };
		}),
		get value() { return value; },
		set value(nv: T) {
			if(value !== nv) {
				value = nv;
				set(nv);
			}
		}
	};
	return rv;
}