<script lang="ts">
	import { text } from '@sveltejs/kit';
	import { beforeNavigate } from "$app/navigation";
	import Wysiwyg from "$sitb/components/form/Wysiwyg.svelte";
	import ImageManager from "$sitb/components/ImageManager.svelte";
	import { flag, languages, type Language } from "$sitb/constants";
	import { ajax, I, language } from "$sitb/globals";
	import { Flag, Input, Field, Form, Button, Tabs, Page, toast, Icon } from "svemantic";
	import type { PageData } from "./$types";
	import { page } from '$app/stores';
	import { compare } from '$sitb/utils';
	import { Loader } from 'svemantic';
	export let data: PageData;
	
	interface Translation {
		lng: Language;
		title?: string;
		text?: string;
	}
	const texts = <Translation[]>data.texts;
	let article: string;
	article = $page.params.article;

	for(const lng in languages)
		if(!texts.find((t: Translation)=> t.lng === lng))
			texts.push({lng: <Language>lng});
	/* TODO Manage dirtiness
	beforeNavigate(async ({to, cancel})=> {
		toast(to === null ? 'null': 'not')
		//cancel();
	});*/
	async function submit({detail: {values}}: CustomEvent<{values: Translation}>) {
		const org = texts.find(t=> t.lng === values.lng);
		console.assert(!!org, 'Language found');
		const diff = compare(values, org);
		if(diff) {
			loadings[values.lng] = true;
			try {
				ajax.patch({lng: values.lng, diff});
			} finally {
				loadings[values.lng] = false;
			}
		}
	}
	const loadings: Partial<Record<Language, boolean>> = {};

</script>
<Tabs active={$language}>
	<Page key="imgs">
		<svelte:fragment slot="header">
			<Icon icon="images outline" /> {$I('ttl.images')}
		</svelte:fragment>
		<ImageManager {article} list={data.imgs} />
	</Page>
	{#each texts as text}
		<Page key={text.lng}>
			<svelte:fragment slot="header">
				<Flag code={flag(text.lng)} /> {languages[text.lng]}
			</svelte:fragment>
			<Form model={text} on:submit={submit}>
				<Loader inverted loading={!!loadings[text.lng]} />
				<input type="hidden" name="lng" />
				<Field name="title">
					<Input>
						<Button slot="left-action" icon="save" submit primary>{$I('cmd.save')}</Button>
					</Input>
				</Field>
				<Field name="text">
					<Wysiwyg name="text" value={text.text} />
				</Field>
			</Form>
		</Page>
	{/each}
</Tabs>