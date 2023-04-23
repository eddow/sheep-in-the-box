<script lang="ts">
	import { page } from '$app/stores';
	import Nf404 from '$sitb/components/Nf404.svelte';
	import { pageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	if(data.article) pageTitle.set(data.article.title);
</script>
{#if data.article}
	{@html data.article.text}
{:else}
	<Nf404 />
{/if}