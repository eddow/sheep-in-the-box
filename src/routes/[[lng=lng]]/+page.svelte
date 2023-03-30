<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { language } from "$sitb/intl";
	import { onDestroy } from "svelte";
	import { pageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	pageTitle.set(data.title);
	let first = true;
	onDestroy(language.subscribe(()=> { if(!first) invalidateAll(); }));
	first = false;
</script>
{@html data.article}