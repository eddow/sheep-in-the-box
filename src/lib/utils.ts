import { browser, dev } from "$app/environment";
import { readable } from "svelte/store";
import type { FormContext } from "./components/form/utils";

const emptyFormInfo: FormContext = <FormContext>{
	form: (node: any)=> {},
	errors: readable({}),
	touched: readable({})
};
export function useCSR(usage: ()=> FormContext): FormContext {
	return browser ? usage() : emptyFormInfo;
}
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