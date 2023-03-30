<script lang="ts" context="module">
	addStyleSheet('/node_modules/summernote/dist/summernote-lite.css');
	const scriptLoad = addScript('/node_modules/summernote/dist/summernote-lite.js');
</script>
<script lang="ts">
	import { Module } from 'svemantic';
	import 'summernote/dist/summernote-lite.css';
	import 'summernote/dist/summernote-lite.js';
	import { addScript, addStyleSheet } from '$sitb/globals';

	// TODO: translate summernote
	export let
		name: string,
		value: string = '';
	const {module, forward} = Module('summernote'),
		config: Summernote.Options = {
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
					value = contents;
				},
			}
		};
</script>
{#await scriptLoad}
	<textarea style="display: none;" use:module={config} {name} {value}></textarea>
{/await}