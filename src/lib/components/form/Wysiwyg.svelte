<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Quill from 'quill';

	export let name: string;
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],

		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
		[{ 'direction': 'rtl' }],                         // text direction

		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		[ 'link', 'image', 'video', 'formula' ],          // add's image support
		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'font': [] }],
		[{ 'align': [] }],

		['clean']                                         // remove formatting button
	];
	let target: HTMLElement, container: HTMLElement, editor: any, config = {
		modules: {
			'toolbar': toolbarOptions
		},
		theme: 'snow'
	};
	onMount(()=> {
		editor = new Quill(target, config);
	});
	onDestroy(()=> {
		if(editor) editor.destroy();
	});
</script>
<svelte:head>
<link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">
</svelte:head>
<div bind:this={container}></div>
<div bind:this={target}></div>