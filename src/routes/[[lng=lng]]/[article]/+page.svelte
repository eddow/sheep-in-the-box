<script lang="ts">
	import { typeComponents } from '$lib/articles';
	import type { ReadArticle } from '$sitb/entities/article';
	import { setPageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	let article: ReadArticle, component: ConstructorOfATypedSvelteComponent|undefined;
	$: {
		article = data.article;
		setPageTitle(article.title);
	}
	$: component = typeComponents[article.type];
</script>
<div class="ui wide container">
{#if component}
	<svelte:component this={component} {article} />
{:else}
	{@html data.text}
{/if}
</div>
