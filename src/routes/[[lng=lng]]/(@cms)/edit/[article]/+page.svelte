<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import Wysiwyg from "$sitb/components/form/Wysiwyg.svelte";
	import ImageManager from "$sitb/components/ImageManager.svelte";
	import { flag, languages, type Language } from "$sitb/constants";
	import { ajax, I, language } from "$sitb/globals";
	import { Flag, Input, Field, Form, Button, Tabs, Page, toast } from "svemantic";
	import type { PageData } from "./$types";
	import { page } from '$app/stores';
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
	beforeNavigate(async ({to, cancel})=> {
		toast(to === null ? 'null': 'not')
		//cancel();
	});
</script>
<Tabs active={$language}>
	<Page key="imgs">
		<svelte:fragment slot="header">
			{$I('ttl.images')}
		</svelte:fragment>
		<ImageManager {article} />
	</Page>
	{#each texts as text}
		<Page key={text.lng}>
			<svelte:fragment slot="header">
				<Flag code={flag(text.lng)} /> {languages[text.lng]}
			</svelte:fragment>
<pre>{JSON.stringify(text, null, '\t')}</pre>
			<Form model={text} let:dirty>
				<input type="hidden" name="lng" />
				<Field name="title">
					<Input>
						<Button disabled={!dirty} slot="left-action" icon="save" submit primary>{$I('cmd.save')}</Button>
					</Input>
				</Field>
				<Wysiwyg name="text" />
			</Form>
		</Page>
	{/each}
</Tabs>