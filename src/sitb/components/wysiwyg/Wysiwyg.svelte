<script lang="ts" context="module">
	export interface LinkInfo {
		url: string
		text: string
		range: any
		isNewWindow: boolean
		checkProtocol: boolean
	}
</script>
<script lang="ts">
	import { Button, Buttons, Checkbox, Field, Input, ModalForm, Page, Tabs, module } from 'svemantic';
	import { I } from '$sitb/globals';
	import ArticleSelect from './ArticleSelect.svelte';
	import type { ListedArticle } from '$sitb/server/article';

	export let
		pickPicture: (() => Promise<string|undefined>) | undefined = undefined,
		articles: ListedArticle[] | undefined = undefined,	// TODO: Load list if not given ?
	// TODO: translate summernote
		name: string,
		value: string = '';
	const summernote = module('summernote'),
		config/*: Summernote.Options*/ = {
			dialogsInBody: true,
			lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
			toolbar: [
				['style', ['style']],
				['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
				['fontname', ['fontname', 'fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['insert', <Summernote.toolbarInsertGroupOptions[]>['pick-link', pickPicture?'pick-picture':'picture', 'hr', 'table']],
				['view', ['codeview', 'help']],
			], popover: {
				air: <Summernote.popoverAirDef><unknown>[	// Version difference between typings and library
					['color', ['color']],
					['font', ['bold', 'underline', 'clear']],
					['para', ['ul', 'paragraph']],
					['table', ['table']],
					['insert', ['pick-link', pickPicture?'pick-picture':'picture']]
				],
				image: <Summernote.popoverImageDef><unknown>[	// Version difference between typings and library
					['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
					['float', ['floatLeft', 'floatRight', 'floatNone']],
					['remove', ['removeMedia']]
				],
				link: [
					['link', ['pick-link', 'unlink']]
				],
			}, buttons: {
				'pick-picture'(context: any) {
					// TODO Tooltip re-show after dialog closes
					const button = context.modules.buttons.button({
						contents: context.ui.icon(context.options.icons.picture),
						tooltip: context.options.langInfo.image.image,
						click: async function () {
							lang = context.options.langInfo;
							context.triggerEvent('dialog.shown');
							context.invoke('editor.saveRange');
							let picture: string|undefined;
							try { picture = (await pickPicture!()); }
							finally { context.invoke('editor.restoreRange'); }
							if(picture) {
								if (this.options.callbacks.onImageLinkInsert)
									context.triggerEvent('image.link.insert', picture);
								else
									context.invoke('editor.insertImage', picture, picture);
							}
						}
					});
					return button.render();
				},
					// TODO Tooltip re-show after dialog closes
				'pick-link'(context: any) {
					const button = context.modules.buttons.button({
						contents: context.ui.icon(context.options.icons.link),
						tooltip: context.options.langInfo.link.link,
						click: async function () {
							lang = context.options.langInfo;
							context.triggerEvent('dialog.shown');
							const
								linkInfo: LinkInfo = context.invoke('editor.getLinkInfo'),
								model: Partial<LinkModel> = {
									text: linkInfo.text,
									isNewWindow: linkInfo.isNewWindow || !linkInfo.url
								};
							if(articles && (!linkInfo.url || linkInfo.url.startsWith('/'))) {
								linkType = 'article';
								model.article = linkInfo.url.substring(1);
							} else if(/^\{.*\}$/.test(linkInfo.url)) {
								linkType = 'code';
								model.code = linkInfo.url.substring(1, linkInfo.url.length-2);
							} else {
								linkType = 'external';
								model.external = linkInfo.url;
							}
							let link: LinkModel|undefined;
							try { link = (await linkPicker(model)); }
							finally { context.invoke('editor.restoreRange'); }
							if(link) {
								linkInfo.text = link.text;
								linkInfo.isNewWindow = linkType === 'external' && link.isNewWindow && link.isNewWindow !== 'off';
								linkInfo.checkProtocol = linkType === 'external';
								linkInfo.url = linkType === 'article' ? '/' + link.article :
									linkType === 'code' ? '{' + link.code + '}' : link.external;
								context.invoke('editor.createLink', linkInfo);
							}
						}
					});
					return button.render();
				}
			}, callbacks: {
				onChange(contents: string) {
					contentValue = value = contents;
				},
				onInit({editingArea}: any) {
					// Avoid svelte-kit to follow the link when they are selected for edition
					editingArea[0].setAttribute('data-sveltekit-reload', '');
				}
			}
		};
	type LinkType = 'article' | 'external' | 'code';
	type LinkModel = {text: string, isNewWindow: boolean|'on'|'off', article: string, external: string, code: string};
	let contentValue: string = value,
		linkPicker: (init: Partial<LinkModel>|undefined)=> Promise<LinkModel|undefined>,
		linkType: LinkType = 'article',
		lang: any;
	$: if(contentValue !== value) {
		summernote('code', value || '');
	}
	// data-sveltekit-reload
</script>
<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.css" />
	</svelte:head>
<textarea style="display: none;" use:summernote={config} {name} bind:value></textarea>
<ModalForm bind:modal={linkPicker}>
	<h2 slot="header">{lang?.link.insert}</h2>
	<Field name="text" required text={lang?.link.textToDisplay}>
		<Input type="text" />
	</Field>
	<Tabs bind:active={linkType}>
		{#if articles}
			<Page key="article">
				<svelte:fragment slot="header">
					{$I('fld.artcl')}
				</svelte:fragment>
				<Field name="article">
					<ArticleSelect {articles} />
				</Field>
			</Page>
		{/if}
		<Page key="external">
			<svelte:fragment slot="header">
				{$I('ttl.external')}
			</svelte:fragment>
			<Field name="external">
				<Input type="url" />
			</Field>
			<Field name="isNewWindow">
				<Checkbox label={lang?.link.openInNewWindow||'-'} />
			</Field>
		</Page>
		<Page key="code">
			<svelte:fragment slot="header">
				{$I('fld.variable')}
			</svelte:fragment>
			<Field name="code">
				<Input type="text" />
			</Field>
		</Page>
	</Tabs>
	<Buttons slot="actions" let:dirty>
		{dirty}
		<Button cancel>{$I('cmd.cancel')}</Button>
		<Button icon="plus" submit primary disabled={!dirty} >{$I('cmd.insert')}</Button>
	</Buttons>
</ModalForm>