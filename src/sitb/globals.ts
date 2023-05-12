import { browser } from "$app/environment";

import { app } from "svemantic";
import { page } from '$app/stores';
import { writable } from "svelte/store";

if(browser) page.subscribe(p=> {
	if(p.url) app.pathname.set(p.url.pathname);
});

export const pageTitle = writable<string>('');
