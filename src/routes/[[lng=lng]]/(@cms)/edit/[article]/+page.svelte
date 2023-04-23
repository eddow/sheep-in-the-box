<script lang="ts">
	import Wysiwyg from "$sitb/components/Wysiwyg.svelte";
	import ImageManager from "$sitb/components/image/ImageManager.svelte";
	import { flag, languages, type Language } from "$sitb/constants";
	import { ajax, I, language } from "$sitb/globals";
	import { Flag, Input, Field, Form, Button, Tabs, Page, toast, Icon, prompt } from "svemantic";
	import type { PageData } from "./$types";
	import { compare } from '$sitb/utils';
	import { Loader } from 'svemantic';
	import ModalForm from "$svemantic/modules/modal/ModalForm.svelte";
	import ImagePicker from "$sitb/components/image/ImagePicker.svelte";
	import Buttons from "$svemantic/elements/button/Buttons.svelte";
	export let data: PageData;
	
	interface Translation {
		lng: Language;
		title?: string;
		text?: string;
	}
	let article: typeof data.article;
	$: {
		article = data.article;
		if(article) for(const lng in languages) {
			const texts = article.texts.find((t: Translation)=> t.lng === lng);
			if(texts)	// Replace image urls
				texts.text = texts.text.replace(/="\$\//g, `="${article.slug}/`);
			else
				article.texts.push({lng: <Language>lng, title: '', text: ''});
		}
	}

	/* TODO Manage dirtiness
	beforeNavigate(async ({to, cancel})=> {
		toast(to === null ? 'null': 'not')
		//cancel();
	});*/
	async function submit({detail: {values}}: CustomEvent<{values: Translation}>) {
		const org = article!.texts.find(t=> t.lng === values.lng);
		console.assert(!!org, 'Language found');
		const diff = compare(values, org!);
		if(diff) {
			if(diff.text) // replace image urls
				diff.text = diff.text.replace(new RegExp(`="${article!.slug}/`, 'g'), '="$/');
			loadings[values.lng] = true;
			try {
				ajax.put({lng: values.lng, diff});
			} finally {
				loadings[values.lng] = false;
			}
		}
	}
	const loadings: Partial<Record<Language, boolean>> = {};
	let picturePicker: ()=> Promise<{url: string}>;
	async function pickPicture() {
		const rv = (await picturePicker())?.url;
		return rv && article!.slug + '/' + rv;
	}
</script>
{#if !article}
	<p>{$I('msg.article-not-found')}</p>
{:else}
	<Tabs active={$language}>
		<Page key="imgs">
			<svelte:fragment slot="header">
				<Icon icon="images outline" /> {$I('ttl.images')}
			</svelte:fragment>
			<ImageManager bind:list={article.images} endpoint={article.slug} />
		</Page>
		{#each article.texts as text}
			<Page key={text.lng}>
				<svelte:fragment slot="header">
					<Flag code={flag(text.lng)} /> {languages[text.lng].text}
				</svelte:fragment>
				<Form model={text} on:submit={submit}>
					<Loader inverted loading={!!loadings[text.lng]} />
					<input type="hidden" name="lng" value={text.lng} />
					<Field name="title">
						<Input>
							<Button slot="left-action" icon="save" submit primary>{$I('cmd.save')}</Button>
						</Input>
					</Field>
					<Field name="text">
						<Wysiwyg {pickPicture} name="text" value={text.text} />
						<ModalForm bind:modal={picturePicker}>
							<h2 slot="header">{$I('ttl.pick-picture')}</h2>
							<Field name="url">
								<ImagePicker name="url" list={article.images} endpoint={article.slug} />
							</Field>
							<Buttons slot="actions" let:dirty>
								{dirty}
								<Button cancel>{$I('cmd.cancel')}</Button>
								<Button icon="plus" submit primary disabled={!dirty} >{$I('cmd.insert')}</Button>
							</Buttons>
						</ModalForm>
					</Field>
				</Form>
			</Page>
		{/each}
	</Tabs>
{/if}