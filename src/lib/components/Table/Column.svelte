<script lang="ts">
	import { specialRow, getTblCtx, setClmnCtx, type ColumnContext, getRowCtx, type RowContext } from './utils'
	import { writable } from "svelte/store";
	import { I } from '$sitb/globals';
	import { Cell, Td, Th } from 'svemantic';
	import type { ComponentProps } from 'svelte';

	type T = $$Generic;
	type keyT = keyof T & string;

	export let prop: keyT|undefined = undefined;
	export let title: string = '';
	export let header: boolean = false;
	export let html: boolean = false;
	let specRow: T|undefined = undefined;
	export {specRow as row};
	const tblSetFilter = getTblCtx().setFilter;
	export let value: any = null;
	const rowCtx = getRowCtx<RowContext<T>>();
	let row: T = specRow === undefined ? rowCtx?.row : specRow;
$:	value = (prop && row && (typeof row === 'object') && row[prop]) || '';
	const config = writable<any>({});
$:	config.set({...$config, value});
$:	config.set({...$config, prop});
$:	config.set({...$config, title: title === undefined ? (prop && $I('fld.'+prop)) : title});
$:	config.set({...$config, header});
$:	config.set({...$config, html});
	let ctx: ColumnContext = {
		setFilter(filter: (name: any)=> boolean) {
			console.assert(!!prop, 'A filtered column must define a `prop`')
			tblSetFilter(prop, filter && ((row: any)=> filter(row[prop])));
		},
		config
	};
	setClmnCtx(ctx);
</script>
{#if !rowCtx}
	<Td class="error message">`Column` is to be used in a `Table` only</Td>
{:else if row === specialRow.filter}
	<slot name="filter">
		<Th></Th>
	</slot>
{:else if row === specialRow.header}
	<slot name="header">
		<Th scope="col">{title || prop || ''}</Th>
	</slot>
{:else if row === specialRow.footer}
	<slot name="footer">
		<Th scope="col" />
	</slot>
{:else}
	<slot {row} {value}>
		<Cell {header} scope="row">
			{#if html}
				{@html value}
			{:else}
				{value}
			{/if}
		</Cell>
	</slot>
{/if}
