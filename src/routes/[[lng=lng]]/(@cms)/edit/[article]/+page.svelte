<script lang="ts">
	import Wysiwyg from "$sitb/components/wysiwyg/Wysiwyg.svelte";
	import ImageManager from "$sitb/components/wysiwyg/image/ImageManager.svelte";
	import { flag, languages, type Language } from "$sitb/constants";
	import { ajax, I, language } from "$sitb/globals";
	import { Flag, Input, Field, Form, Button, Tabs, Page, toast, Icon, prompt, InputHidden } from "svemantic";
	import type { PageData } from "./$types";
	import { compare } from '$sitb/utils';
	import { Loader } from 'svemantic';
	import ModalForm from "$svemantic/modules/modal/ModalForm.svelte";
	import ImagePicker from "$sitb/components/wysiwyg/image/ImagePicker.svelte";
	import Buttons from "$svemantic/elements/button/Buttons.svelte";
	import { getContext } from "svelte";
	import { type EditionContext, editionContext } from "../+layout.svelte";
	export let data: PageData;
	
	interface Translation {
		lng: Language;
		title: string;
		text: string;
	}
	const {setTitle, articles} = getContext<EditionContext>(editionContext);
	let article: typeof data.article;
	$: {
		article = data.article;
		if(article) for(const lng in languages) {
			const texts = article.texts.find((t: Translation)=> t.lng === lng);
			if(!texts) article.texts.push({lng: <Language>lng, title: '', text: ''});
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
			loadings[values.lng] = true;
			try {
				await ajax.put({lng: values.lng, diff});
				if(diff.title) setTitle(article!.slug, values.lng, diff.title);
				article!.texts[article!.texts.indexOf(org!)] = values;
			} finally {
				loadings[values.lng] = false;
			}
		}
	}
	const loadings: Partial<Record<Language, boolean>> = {};
	type PictureType = 'internal' | 'external';
	let picturePicker: ()=> Promise<{internal: string, external: string}>,
		pictureType: PictureType = 'internal';
	async function pickPicture() {
		const rv = await picturePicker();
		return rv && (pictureType === 'internal' ? `/${article!.slug}/${rv.internal}` : rv.external);
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
			<ImageManager articles={$articles} bind:list={article.images} endpoint={article.slug} />
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
						<Wysiwyg {pickPicture} articles={$articles} name="text" value={text.text} />
					</Field>
				</Form>
			</Page>
		{/each}
	</Tabs>
	<ModalForm bind:modal={picturePicker}>
		<h2 slot="header">{$I('ttl.pick-picture')}</h2>
		<Tabs bind:active={pictureType}>
			<Page key="internal">
				<svelte:fragment slot="header">
					{$I('ttl.internal')}
				</svelte:fragment>
				<Field name="internal">
					<ImagePicker list={article.images} endpoint={article.slug} />
				</Field>
			</Page>
			<Page key="external">
				<svelte:fragment slot="header">
					<Icon icon="linkify" /> {$I('ttl.external')}
				</svelte:fragment>
				<Field name="external">
					<Input type="url" />
				</Field>
			</Page>
		</Tabs>
		<Buttons slot="actions" let:dirty>
			{dirty}
			<Button cancel>{$I('cmd.cancel')}</Button>
			<Button icon="plus" submit primary disabled={!dirty} >{$I('cmd.insert')}</Button>
		</Buttons>
	</ModalForm>
{/if}