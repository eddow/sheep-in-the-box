<script lang="ts">

	import type { ArticleType } from '$sitb/constants';
	import type { ReadArticle } from '$sitb/entities/article';
	import { pageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	import Ctlg from './types/Ctlg.svelte';
	const typeComponents: Partial<Record<ArticleType, ConstructorOfATypedSvelteComponent>> = {
		ctlg: Ctlg
	};
	let article: ReadArticle, component: ConstructorOfATypedSvelteComponent|undefined;
	$: {
		article = data.article;
		pageTitle.set(article.title);
	}
	$: component = typeComponents[article.type];
</script>
{#if component}
	<svelte:component this={component} {article} />
{:else}
	{@html data.text}
{/if}