<script lang="ts">
	import Code from '$sitb/components/form/Code.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';
	import type { TextType } from '$sitb/constants';

	export let value: string;
	const { config } = getClmnCtx();
	let prop: string;
$:	prop = <string>$config.prop;
	export let autofocus: boolean = false;
	export let preview: TextType = '';
</script>
<Editor {value}>
	<Code {autofocus} bind:value name={prop} {preview} {...$$restProps} />
</Editor>