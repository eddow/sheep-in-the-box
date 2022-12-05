<script lang="ts">
	import Code from '$lib/components/form/Code.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';
	import type { TextType } from '$lib/constants';

	export let value: string;
	const { config } = getClmnCtx();
	let prop: string;
$:	prop = <string>$config.prop;
	export let autofocus: boolean = false;
	export let preview: TextType = '';
</script>
<Editor {value}>
	<Code {autofocus} {value} name={prop} {preview} {...$$restProps} />
</Editor>