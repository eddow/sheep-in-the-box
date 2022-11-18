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
	export let autofocus: boolean = false;
	export let options: any[];
	function getDisplay(value: string) {
		return options.find(o=> o.value === value)?.text || value;
	}
</script>
<Editor {...$$restProps} {getDisplay}>
	{#if $editing}
		<Input {autofocus} type="select" bind:value={$editing[prop]} name={prop}>
			{#each options as option}
				{#if typeof option === 'string'}
					<option>{option}</option>
				{:else}
					<option value={option.value}>{option.text}</option>
				{/if}
			{/each}
		</Input>
	{/if}
</Editor>