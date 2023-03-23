<script lang="ts">
	import Code from '$sitb/components/form/Code.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../utils'
	import type { TextType } from '$sitb/constants';

	export let value: string,
		autofocus: boolean = false,
		preview: TextType = '';
	const { config } = getClmnCtx();
	let prop: string;
$:	prop = <string>$config.prop;
</script>
<Editor {value}>
	<Code {autofocus} bind:value name={prop} {preview} {...$$restProps} />
</Editor>