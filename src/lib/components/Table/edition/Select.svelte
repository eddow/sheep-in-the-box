<script lang="ts">
	import { FormGroup, Input } from 'sveltestrap';
	import Column from './Column.svelte'
	import {getRowCtx} from '../utils'
	import type { EditingRowContext } from './utils';

	const {row, editing, dialog} = getRowCtx<EditingRowContext>();
	export let prop: string;
	export let title: string = '';
	export let required: boolean = false;
	export let autofocus: boolean = false;
	export let options: any[];
	function transform(value: string) {
		return options.find(o=> o.value === value)?.text || value;
	}
</script>
<Column {...$$props} {prop} {transform}>
	{#if $editing}
		<Input {autofocus} {required} type="select" bind:value={$editing[prop]} placeholder={title}>
			{#each options as option}
				{#if typeof option === 'string'}
					<option>{option}</option>
				{:else}
					<option value={option.value}>{option.text}</option>
				{/if}
			{/each}
		</Input>
	{/if}
</Column>