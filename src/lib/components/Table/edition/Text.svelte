<script lang="ts">
	import { Input } from 'sveltestrap';
	import Column from '../Column.svelte'
	import {getRowCtx} from '../utils'
	import type { EditingContext } from './TableRow.svelte';

	const rowCtx = getRowCtx<EditingContext>(),
		row = rowCtx.row,
		editing = rowCtx.editing;
	export let prop: string;
	export let title: string = '';
	export let headers: boolean = false;
	export let area: boolean = false;
	export let html: boolean = false;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
</script>
<Column {title}>
{#if $editing}
	<slot name="edit">
		<td class="selection">
			<Input type={area ? 'textarea' : 'text'} bind:value={row[prop]} />
		</td>
	</slot>
{:else}
	<slot>
		<svelte:element this={headers?'th':'td'} {...thProps}>
			{#if html}
				{@html row[prop]}
			{:else}
				{row[prop]}
			{/if}
		</svelte:element>
	</slot>
{/if}
</Column>
