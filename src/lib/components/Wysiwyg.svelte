<script lang="ts" context="module">/*
	addStyleSheet('/node_modules/summernote/dist/summernote-lite.css');
	const scriptLoad = addScript('/node_modules/summernote/dist/summernote-lite.js');*//*
	addStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css');
	const scriptLoad = addScript('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js');*/
	addStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.css');
	const scriptLoad = addScript('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.js');
</script>
<script lang="ts">
	import { module } from 'svemantic';/*
	import 'summernote/dist/summernote-lite.css';
	import 'summernote/dist/summernote-lite.js';*//*
	import 'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css';
	import 'https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js';*/
	import { I, addScript, addStyleSheet } from '$sitb/globals';
	import { onMount, tick } from 'svelte';

	export let
		pickPicture: (() => Promise<string>) | undefined = undefined;

	// TODO: translate summernote
	export let
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
				['insert', <Summernote.toolbarInsertGroupOptions[]>['link', 'picture', pickPicture?'pick-picture':'', 'hr', 'table']],
				['view', ['codeview', 'help']],
			], popover: {
				air: <Summernote.popoverAirDef><unknown>[	// Version difference between typings and library
					['color', ['color']],
					['font', ['bold', 'underline', 'clear']],
					['para', ['ul', 'paragraph']],
					['table', ['table']],
					['insert', ['link', 'picture', pickPicture?'pick-picture':'']]
				],
				image: <Summernote.popoverImageDef><unknown>[	// Version difference between typings and library
					['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
					['float', ['floatLeft', 'floatRight', 'floatNone']],
					['remove', ['removeMedia']]
				],
				link: [
					['link', ['linkDialogShow', 'unlink']]
				],
			}, buttons: {
				'pick-picture'(context: any) {
					// create button
					// TODO Tooltip re-show after dialog closes
					const button = context.modules.buttons.button({
						contents: '<i class="images outline icon"></i>',
						tooltip: $I('cmd.pick-picture'),
						click: async function () {
							const picture = await pickPicture!();
							if(picture)
								context.invoke('editor.insertImage', picture, picture);
						}
					});
					return button.render();
				}
			}, callbacks: {
				onChange(contents: string) {
					contentValue = value = contents;
				}
			}
		};
	onMount(() => {
		placeHolder = false;
	});
	let contentValue: string = value, placeHolder = true;
	$: if(contentValue !== value) {
		summernote('code', value || '');
	}
</script>
{#await scriptLoad}
	<textarea style="display: none;" use:summernote={config} {name} bind:value></textarea>
{/await}
{#if placeHolder}
	<div class="ui placeholder">
		<div class="paragraph">
			<div class="line"></div>
			<div class="line"></div>
			<div class="line"></div>
			<div class="line"></div>
			<div class="line"></div>
		</div>
	</div>
{/if}