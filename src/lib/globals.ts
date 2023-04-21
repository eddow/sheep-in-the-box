export { I, language } from "./intl";
export { ajax } from "./ajax";
export { user } from "./user";
import { browser, dev } from "$app/environment";
import { writable } from "svelte/store";

import { app } from "svemantic";
import { page } from '$app/stores';

if(browser) page.subscribe(p=> {
	if(p.url) app.pathname.set(p.url.pathname);
});

const min = dev? '' : '.min';
export const pageTitle = writable<string>('');
let scriptPromises: Partial<Record<string, Promise<void>>> = {},
	scriptWaiters: Record<string, ()=> void> = {};
export let
	scripts: string[] = [],
	//styles: string[] = [`/dist/semantic${min}.css`];
	styles: string[] = [`https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic${min}.css`];
export function addStyleSheet(ss: string) {
	if(!styles.includes(ss)) styles = [...styles, ss];
}
export function addScript(ss: string) {
	if(!scriptPromises[ss]) {
		scriptPromises[ss] = new Promise<void>((resolve)=> {
			scriptWaiters[ss] = resolve;
		});
		scripts = [...scripts, ss];
	}
	return scriptPromises[ss];
}
export function scriptLoaded(ss: string) {
	scriptWaiters[ss]();
}
/*
addScript(`/node_modules/jquery/dist/jquery${min}.js`);
addScript(`/dist/semantic${min}.js`);*/
addScript(`https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery${min}.js`);
addScript(`https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic${min}.js`);