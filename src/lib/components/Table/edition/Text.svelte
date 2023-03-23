<script lang="ts">
	import { Input } from 'svemantic';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { config } = getClmnCtx(),
		{ dialog } = getRowCtx<EditingRowContext>();
	// TODO In all editors: value is bound with rowCtx (readable->writable?) and prop
	let prop: string;
$:	prop = <string>$config.prop;
	export let value: string,
		placeholder: string | undefined = undefined,
		area: boolean = false,
		autofocus: boolean = false;
</script>
<Editor {...$$restProps} {value}>
	{#if dialog}
		<Input {placeholder} {autofocus} fluid type={area ? 'area' : 'text'} bind:value name={prop} />
	{:else}
		<td class:area={area}><Input {placeholder} {autofocus} type={area ? 'area' : 'text'} bind:value name={prop} /></td>
	{/if}
</Editor>
<style lang="scss" global>
	.ui.fluid.input > textarea {
		flex: 1 0 auto;
	}
	table.ui.table tr.edition > td.area {
		padding: 0;
	}
</style>