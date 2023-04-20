<script lang="ts">
	import { type ArticleType, type Language, articleTypes } from "$sitb/constants";
	import { Input, Field, Button, Buttons, LinkItem, Menu, ModalForm, Select } from "svemantic";
	import type { LayoutData } from "./$types";
	import { I } from "$sitb/intl";
	import { Keys, slugify } from "$sitb/utils";
	import { ajax } from "$sitb/globals";
	import { goto } from "$app/navigation";
	export let data: LayoutData;
	
	interface Article {
		slug: string,
		lngs: Language[],
		type: ArticleType
	}
	let articles: Article[];
	$: articles = data.list;
	let createModel: Partial<Article>|undefined = undefined;
	function create() { createModel = {}; }
	async function submit({detail: {values}}: CustomEvent) {
		const slug = slugify(values.name), article = {type: values.type, slug};
		const rv = await ajax.post(article, '/edit');
		if(rv.status === 200) {
			articles = [{lngs: [], ...article}, ...articles];
			goto('/edit/'+slug);
		}
	}
	const types = Keys(articleTypes).map(k=> ({
		value: k,
		text: $I('artcl.type.'+k),	// TODO? reactive
		icon: articleTypes[k].icon,
		color: articleTypes[k].color
	}));
</script>
<div class="main-page toc">
	<Menu vertical>
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
		{#each articles as article}
			<LinkItem href={'/edit/'+article.slug} icon={articleTypes[article.type].icon} text={article.slug} />
		{/each}
	</Menu>
</div>
<div class="main-page article">
	<slot />
</div>
<style lang="scss" global>
	.field.inline-block {
		display: inline-block;
		min-width: 16em;
	}
	.main-page.toc {
		position: fixed;
		z-index: 1;
		width: 250px;
		flex: 0 0 auto;
	}
	.main-page.article {
		flex: 1 1 auto;
		min-width: 0;
		margin-left: 250px;
	}
</style>