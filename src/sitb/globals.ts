import { browser } from "$app/environment";

import { app } from "svemantic";
import { page } from '$app/stores';
import globic from "./globic";
import { privateStore } from "./stores/privateStore";
import { frwrdReadable } from "./stores/frwrdStore";
import { onDestroy } from "svelte";

if(browser) page.subscribe(p=> {
	if(p.url) app.pathname.set(p.url.pathname);
});

const pageTitleStore = globic(()=> privateStore<string>()),
	pageTitles = globic(()=> <string[]>[]);
export const pageTitle = frwrdReadable(()=> pageTitleStore.store);
export function setPageTitle(title: string) {
	pageTitles.push(pageTitleStore.value);
	pageTitleStore.value = title;
	onDestroy(()=> { pageTitleStore.value = pageTitles.pop() || ''; })
}