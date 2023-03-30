<script lang="ts">
	import { type ArticleType, type Language, articleTypes } from "$sitb/constants";
	import Icon from "$svemantic/elements/Icon.svelte";
	import { LinkItem, Menu } from "svemantic";
	import type { LayoutData } from "./$types";
	export let data: LayoutData;
	
	const slugify = (str: string) => str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
	interface Article {
		name: string,
		title: string,
		lngs: Language[],
		type: ArticleType
	}
	const articles: Article[] = data.list;
</script>
<div class="toc">
	<Menu vertical>
		{#each articles as article}
			<LinkItem href={'/edit/'+article.name} icon={articleTypes[article.type].icon}>{article.name}</LinkItem>
		{/each}
	</Menu>
</div>
<div class="article">
	<slot />
</div>
<style lang="scss">
.toc {
    position: fixed;
    z-index: 1;
    width: 250px;
    flex: 0 0 auto;
}
.article {
    flex: 1 1 auto;
    min-width: 0;
    margin-left: 250px;
}
</style>