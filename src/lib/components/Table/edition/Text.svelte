<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { editing } = getRowCtx<EditingRowContext>();
	const { config } = getClmnCtx();
	let prop: string, title: string;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
	export let area: boolean = false;
	export let autofocus: boolean = false;
</script>
<Editor {...$$restProps}>
	{#if $editing}
		<Input {autofocus} type={area ? 'textarea' : 'text'} bind:value={$editing[prop]} name={prop} />
	{/if}
</Editor>