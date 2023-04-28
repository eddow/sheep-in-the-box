export { I, language } from "./intl";
export { ajax } from "./ajax";
export { user } from "./user";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

import { app } from "svemantic";
import { page } from '$app/stores';

if(browser) page.subscribe(p=> {
	if(p.url) app.pathname.set(p.url.pathname);
});

export const pageTitle = writable<string>('');
