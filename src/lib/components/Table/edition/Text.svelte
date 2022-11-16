<script lang="ts">
	import { FormGroup, Input } from 'sveltestrap';
	import Column from './Column.svelte'
	import {getRowCtx} from '../utils'
	import type { EditingRowContext } from './utils';

	const {row, editing, dialog} = getRowCtx<EditingRowContext>();
	export let prop: string;
	export let title: string = '';
	export let area: boolean = false;
	export let required: boolean = false;
	export let autofocus: boolean = false;
</script>
<Column {...$$props} {prop}>
	{#if $editing}
		<Input {autofocus} {required} type={area ? 'textarea' : 'text'} bind:value={$editing[prop]} name={prop} placeholder={title} />
	{/if}
</Column>