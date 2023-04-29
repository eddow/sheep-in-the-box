<script lang="ts" context="module">
	export type RowModel<T> = T|'header'|'filter'|'footer';
</script>
<script lang="ts">
	import { Table } from 'svemantic';
	import TableRow from './TableRow.svelte'
	import { setTblCtx } from './contexts'
	import { privateStore } from '$sitb/stores/privateStore';
	import type { ComponentProps, ComponentType } from 'svelte';
	// ? https://www.npmjs.com/package/svelte-tiny-virtual-list

	type T = $$Generic;
	type keyT = keyof T & string;
	const TableT = Table<T>;

	interface $$Props extends ComponentProps<Table<T>> {
		data: T[];
		columnFilters?: boolean;
		columnHeaders?: boolean;
		columnFooters?: boolean;
		filters?: Map<any, (model: T)=> boolean>;
		context?: any;
		rowType?: ComponentType;
		unfiltered?: T[];
		key?: keyT;
		displayedData?: T[];
	}

	export let
		columnFilters: boolean = false,
		columnHeaders: boolean = true,
		columnFooters: boolean = false,
		filters = new Map<any, (model: T)=> boolean>(),
		context = {},
		rowType: ComponentType = TableRow,
		data: T[],
		unfiltered: T[] = [],
		key: keyT | undefined = undefined;
	let displayedData: T[] = [];
	const dataPrv = privateStore(data);
	$: dataPrv.value = data;
	setTblCtx({
		...context,
		data: dataPrv.store,
		setFilter(key: keyT, filter?: (model: T)=> boolean) {
			if(filter) filters.set(key, filter);
			else filters.delete(key);
			filters = filters;
		}
	});
	function rowId(model: T) { return key && model[key]; }
$:	console.assert(key || !filters.size, 'A table with `filters` needs a `key`');	// Indexes are not a good key as they change while filtering
$:	displayedData = data.filter((model: T)=>
		unfiltered.includes(model) || Array.from(filters.values()).every(filter=> filter(model)))
	const id = (x: RowModel<T>)=> x;
</script>
<TableT {...$$restProps}>
	<thead>
		<slot name="header" />
		{#if columnHeaders}
			<svelte:component this={rowType} id="header" model={id('header')}>
				<slot model={id('header')} />
			</svelte:component>
		{/if}
		{#if columnFilters}
			<svelte:component this={rowType} id="filter" model={id('filter')}>
				<slot model={id('filter')} />
			</svelte:component>
		{/if}
	</thead>
	<tbody>
		{#each displayedData as model, ndx (rowId(model) || ndx)}
			<svelte:component this={rowType} id={rowId(model)} model={id(model)}>
				<slot model={model} />
			</svelte:component>
		{/each}
	</tbody>
	<tfoot>
		{#if columnFooters}
			<svelte:component this={rowType} id="footer" model={id('footer')}>
				<slot model={id('header')} />
			</svelte:component>
		{/if}
		<slot name="footer" />
	</tfoot>
	{#if $$slots.once}
		<tr style="display: none">
			<td>
				<slot name="once" />
			</td>
		</tr>
	{/if}
</TableT>
