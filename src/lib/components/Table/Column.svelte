<script lang="ts">
	import {specialRow, getRowCtx, getTblCtx, setClmnCtx} from './utils'
	import {writable} from "svelte/store";
	import { element } from 'svelte/internal';

	export let prop: string = '';
	export let title: string = '';
	export let headers: boolean = false;
	export let html: boolean = false;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
	let row: any = getRowCtx().row;
	const tblSetFilter = getTblCtx().setFilter;
	let ctx: any = {
		setFilter(filter: (name: any)=> boolean) {
			console.assert(!!prop, 'A filtered column must define a `prop`')
			// TODO: `prop` -> `thisControl` : find back that API
			tblSetFilter(prop, filter && ((row: any)=> filter(row[prop])));
		}
	};
	export let value: any = prop && (typeof row === 'object') && row[prop];
	ctx.value = value;
	setClmnCtx(ctx);
</script>
{#if !row}
	<th>`Column` is to be used in a `Table` only</th>
{:else if row === specialRow.filter}
	<slot name="filter">
		<td />
	</slot>
{:else if row === specialRow.header}
	<slot name="header">
		<th scope="col">{title || prop}</th>
	</slot>
{:else if row === specialRow.footer}
	<slot name="footer">
		<th scope="col" />
	</slot>
{:else}
	<slot>
		<svelte:element this={headers?'th':'td'} {...thProps}>
			{#if html}
				{@html value}
			{:else}
				{value}
			{/if}
		</svelte:element>
	</slot>
{/if}
