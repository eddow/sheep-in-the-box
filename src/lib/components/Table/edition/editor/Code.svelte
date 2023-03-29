<script lang="ts">
	import Code from '$sitb/components/form/Code.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../contexts'
	import type { TextType } from '$sitb/constants';

	export let value: string,
		autofocus: boolean = false,
		preview: TextType = '';
	const { config } = getClmnCtx();
	let name: string;
$:	name = <string>$config.name;
</script>
<Editor {value}>
	<Code {autofocus} bind:value name={name} {preview} {...$$restProps} />
</Editor>