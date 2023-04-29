<script lang="ts" context="module">
	export const editionContext = Symbol('EditionContext');
	export interface EditionContext  {
		rename(slug: string, newSlug: string, type: ArticleType): void;
		setTitle(slug: string, lng: Language, title: string): void;
		articles: Readable<ListedArticle[]>;
	}
</script>
<script lang="ts">
	import { type ArticleType, type Language, articleTypes } from "$sitb/constants";
	import { Input, Field, Button, Buttons, LinkItem, Menu, ModalForm, Select, Label, popup } from "svemantic";
	import type { LayoutData } from "./$types";
	import { slugify } from "$sitb/utils";
	import { ajax, language, I } from "$sitb/globals";
	import { goto } from "$app/navigation";
	import { setContext } from "svelte";
	export let data: LayoutData;
	import type { ListedArticle } from "$sitb/server/article";
	import type { Readable } from "svelte/store";
	import { privateStore } from "$sitb/stores/privateStore";
	
	let articles: ListedArticle[],
		articlePrv = privateStore<ListedArticle[]>(),
		filtered: ListedArticle[],
		createModel: Partial<ListedArticle>|undefined = undefined,
		search: string = '',
		slugSearch: string,
		typeSearch: ArticleType | undefined,
		types: {value: ArticleType, text: string, icon: string, color: string}[];
	$: articles = data.list;
	$: articlePrv.value = articles;
	$: slugSearch = slugify(search);
	$: filtered = (search || typeSearch) ? articles.filter(a=>
		(!typeSearch || a.type === typeSearch) &&
		(a.slug.includes(slugSearch) ||
		((ttl)=> (ttl && slugify(ttl).includes(slugSearch)))(a.titles[$language]))
	) : articles;
	$: types = Object.entries(articleTypes).map(([k, v])=> ({
		value: <ArticleType>k,
		text: $I('artcl.type.'+k),
		icon: v.icon,
		color: v.color
	}));
	function create() { createModel = {titles: {}}; }
	async function submit({detail: {values}}: CustomEvent) {
		const slug = slugify(values.name), article = {type: values.type, slug, titles: {}, images: []};
		const rv = await ajax.post(article, '/edit');
		if(rv.status === 200) {
			articles = [article, ...articles];
			goto('/edit/'+slug);
		}
	}
	setContext<EditionContext>(editionContext, {
		rename(slug: string, newSlug: string, type: ArticleType) {
			const article = articles.find(a=> a.slug === slug);
			if(article) Object.assign(article, {slug: newSlug, type});
		},
		setTitle(slug: string, lng: Language, title: string) {
			const ndx = articles.findIndex(a=> a.slug === slug);
			if(~ndx) articles[ndx].titles[lng] = title;
		},
		articles: articlePrv.store
	});
</script>
<Menu vertical class="main-page toc">
	<Button on:click={create} fluid positive icon="add">{$I('cmd.artcl.new')}</Button>
	<ModalForm model={createModel} on:submit={submit}>
		<svelte:fragment slot="header">
			{$I('ttl.new.elipsis')}
			<Field required class="inline-block" name="type"><Select placeholder={$I('fld.artcl.type')} transparent options={types} /></Field>
		</svelte:fragment>
		<Field required name="name" label>
			<Input name="name">
				<span slot="postfix" class="ui tag label" let:value>{slugify(value)}</span>
			</Input>
		</Field>
		<Buttons slot="actions">
			<Button tiny submit primary icon="save">{$I('cmd.create')}</Button>
			<Button tiny cancel color="yellow" icon="times">{$I('cmd.cancel')}</Button>
		</Buttons>
	</ModalForm>
	<Input fluid type="search" bind:value={search} left-icon="search" />
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
		<LinkItem href={'/edit/'+article.slug} icon={articleTypes[article.type].icon}>
			{#each [article.titles[$language]] as title}
				{#if title}
					{title}
				{:else}
					&nbsp;
					<Label>{article.slug}</Label>
				{/if}
			{/each}
		</LinkItem>
	{/each}
</Menu>
<div class="main-page article">
	<slot />
</div>
<style lang="scss" global>
	.field.inline-block {
		display: inline-block;
		min-width: 16em;
	}
	.ui.main-page.toc {
		position: fixed;
		z-index: 1;
		width: 234px;
		flex: 0 0 auto;
	}
	.main-page.article {
		flex: 1 1 auto;
		min-width: 0;
		margin-left: 250px;
	}
</style>