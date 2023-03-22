<script lang="ts">
	import { Table } from 'svemantic';
	import TableRow from './TableRow.svelte'
	import { specialRow, setTblCtx } from './utils'
	import { privateStore } from '$sitb/privateStore';
	import type { ComponentProps } from 'svelte';
	// ? https://www.npmjs.com/package/svelte-tiny-virtual-list

	type T = $$Generic;
	type keyT = keyof T & string;

	interface $$Props extends ComponentProps<Table<T>> {
		data?: T[];
		
		columnFilters?: boolean;
		columnHeaders?: boolean;
		columnFooters?: boolean;
		filters?: Map<any, (row: T)=> boolean>;
		context?: any;
		rowType?: typeof TableRow;
		unfiltered?: T[];
		key?: keyT;
		displayedData?: T[];
	}

	export let columnFilters: boolean = false;
	export let columnHeaders: boolean = true;
	export let columnFooters: boolean = false;
	export let filters = new Map<any, (row: T)=> boolean>();
	export let context = {};
	export let rowType = TableRow;
	export let data: T[] = <T[]>[null];
	export let unfiltered: T[] = [];
	const dataStore = privateStore(data);
$:	dataStore.value = data;
	setTblCtx({
		...context,
		data: dataStore.store,
		setFilter(key: keyT, filter?: (row: T)=> boolean) {
			if(filter) filters.set(key, filter);
			else filters.delete(key);
			filters = filters;
		}
	});
	export let key: keyT | undefined = undefined;
	function rowId(row: T) { return key && row[key]; }
	export let displayedData: T[] = [];
$:	console.assert(key || !filters.size, 'A table with `filters` needs a `key`');	// Indexes are not a good key as they change while filtering
$:	displayedData = data.filter((row: T)=>
		~unfiltered.indexOf(row) ||
		Array.from(filters.values()).every(filter=> filter(row)))
	// TODO Forward classes & styles
</script>
<Table {...$$restProps}>
	<thead>
		<slot name="header" />
		{#if columnHeaders}
			<svelte:component this={rowType} id="header" row={specialRow.header}>
				<slot row={specialRow.header} />
			</svelte:component>
		{/if}
		{#if columnFilters}
			<svelte:component this={rowType} id="filter" row={specialRow.filter}>
				<slot row={specialRow.filter} />
			</svelte:component>
		{/if}
	</thead>
	<tbody>
		{#each displayedData as row, ndx (rowId(row) || ndx)}
			<svelte:component this={rowType} id={rowId(row)} row={row}>
				<slot row={row} />
			</svelte:component>
		{/each}
	</tbody>
	{#if columnFooters}
		<tfoot>
			<svelte:component this={rowType} id="footer" row={specialRow.footer}>
				<slot row={specialRow.footer} />
			</svelte:component>
		</tfoot>
	{/if}
	{#if $$slots.footer}
		<tfoot>
			<slot name="footer" />
		</tfoot>
	{/if}
</Table>
