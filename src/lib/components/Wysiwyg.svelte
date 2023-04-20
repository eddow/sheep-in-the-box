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
	import { addScript, addStyleSheet } from '$sitb/globals';

	// TODO: translate summernote
	export let
		name: string,
		value: string = '';
	const summernote = module('summernote'),
		config: Summernote.Options = {
			dialogsInBody: true,
			lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
			toolbar: [
				['style', ['style']],
				['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
				['fontname', ['fontname', 'fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['insert', ['link', 'picture', 'video', 'hr', 'table']],
				['view', ['codeview', 'help']],
			], popover: {
				air: <Summernote.popoverAirDef><unknown>[	// Version difference between typings and library
					['color', ['color']],
					['font', ['bold', 'underline', 'clear']],
					['para', ['ul', 'paragraph']],
					['table', ['table']],
					['insert', ['link', 'picture']]
				],
				image: <Summernote.popoverImageDef><unknown>[	// Version difference between typings and library
					['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
					['float', ['floatLeft', 'floatRight', 'floatNone']],
					['remove', ['removeMedia']]
				],
				link: [
					['link', ['linkDialogShow', 'unlink']]
				],
			},
			callbacks: {
				onChange(contents, editable) {
					contentValue = value = contents;
				},
			}
		};
	let contentValue: string = value;
	$: if(contentValue !== value) {
		summernote('code', value || '');
	}
</script>
{#await scriptLoad}
	<textarea style="display: none;" use:summernote={config} {name} bind:value></textarea>
{/await}