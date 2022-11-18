import { browser } from "$app/environment";
import { readable } from "svelte/store";
import type { FormContext } from "./components/form/utils";

const emptyFormInfo: FormContext = <FormContext>{
	form: (node: any)=> {},
	errors: readable({}),
	touched: readable({})
};
export function useCSR(usage: ()=> FormContext) {
	return browser ? usage() : emptyFormInfo;
}

export function assertNnull<T>(v: T, msg: string): T {
	console.assert(v, msg);
	return v;
}