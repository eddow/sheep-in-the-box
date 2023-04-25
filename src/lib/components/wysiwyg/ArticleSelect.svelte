<script lang="ts">
	import { slugify } from '$sitb/utils';
	import { type ArticleType, articleTypes } from "$sitb/constants";
	import { Button, Buttons, Menu, Label, Input, Select1, Icon } from "svemantic";
	import { language, I } from "$sitb/globals";
	import type { ListedArticle } from "$sitb/server/article";
	
	export let
		articles: ListedArticle[],
		value: ListedArticle|undefined;
	let filtered: ListedArticle[],
		typeSearch: ArticleType | undefined,
		types: {value: ArticleType, text: string, icon: string, color: string}[],
		slugValue: string = '';
	$: filtered = typeSearch ? articles.filter(a=> a.type === typeSearch) : articles;
	$: types = Object.entries(articleTypes).map(([k, v])=> ({
		value: <ArticleType>k,
		text: $I('artcl.type.'+k),
		icon: v.icon,
		color: v.color
	}));
	$: value = slugValue ? articles.find(({slug})=> slug === slugValue) : undefined;
</script>
<Select1 fluid bind:value={slugValue} search>
	<div class="menu">
		<Buttons fluid>
			<Button popup={$I('select.all')} on:click={()=> typeSearch = undefined} active={!typeSearch} tiny />
			{#each types as type}
				<Button popup={$I('artcl.type.'+type.value)}
					on:click={()=> typeSearch = type.value}
					active={typeSearch === type.value}
					tiny icon={type.icon}
				/>
			{/each}
		</Buttons>
		{#each filtered as article}
			<div data-value={article.slug} class="item">
				{#each [article.titles[$language]] as title}
					<Icon icon={articleTypes[article.type].icon} />
					{#if title}
						{title}
					{:else}
						&nbsp;
					{/if}
					<Label>{article.slug}</Label>
				{/each}
			</div>
		{/each}
	</div>
</Select1>