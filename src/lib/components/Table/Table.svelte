<script lang="ts">
	import TableRow from './TableRow.svelte'
	import { specialRow, setTblCtx } from './utils'
  	import { exclude } from '../utils/exclude'
  	import { prefixFilter } from '../utils/prefixFilter'
	import { privateStore } from '$lib/privateStore';
	import VirtualList from '@sveltejs/svelte-virtual-list';

	export let columnFilters: boolean = false;
	export let columnHeaders: boolean = true;
	export let columnFooters: boolean = false;
	export let filters = new Map<any, (row: any)=> boolean>();
	export let context = {};
	export let rowType = TableRow;
	export let data: any[];
	export let unfiltered: any[] = [];
	const dataStore = privateStore(data);
$:	dataStore.value = data;
	setTblCtx({
		...context,
		data: dataStore.store,
		setFilter(key: any, filter?: (row: any)=> boolean) {
			if(filter) filters.set(key, filter);
			else filters.delete(key);
			filters = new Map<any, (row: any)=> boolean>(filters);
		}
	});
	export let key: string | null = null;
	function rowId(row: any) { return key && row[key]; }
	export let displayedData: any[] = [];
$:	console.assert(key || !filters.size, 'A table with `filters` needs a `key`');	// Indexes are not a good key as they change while filtering
$:	displayedData = data.filter((row: any)=>
		~unfiltered.indexOf(row) ||
		Array.from(filters.values()).every(filter=> filter(row)))
	// TODO Forward classes & styles
</script>
<div class="table" {...exclude($$props, ['tr$'])}>
	{#if $$slots.header}
		<div class="thead">
			<slot name="header" />
		</div>
	{/if}
	{#if columnHeaders}
		<div class="thead">
			<svelte:component this={rowType} id="header" row={specialRow.header} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.header} />
			</svelte:component>
		</div>
	{/if}
	{#if columnFilters}
		<div class="thead">
			<svelte:component this={rowType} id="filter" row={specialRow.filter} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.filter} />
			</svelte:component>
		</div>
	{/if}
	<div class="tbody">
		{#each displayedData as row, ndx (rowId(row) || ndx)}
		<!-- VirtualList items={displayedData} let:item={row} -->
			<svelte:component this={rowType} id={rowId(row)} row={row} {...prefixFilter($$props, 'tr$')}>
				<slot row={row} />
			</svelte:component>
		<!-- /VirtualList -->
		{/each}
	</div>
	{#if columnFooters}
		<div class="tfoot">
			<svelte:component this={rowType} id="footer" row={specialRow.footer} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.footer} />
			</svelte:component>
		</div>
	{/if}
	{#if $$slots.footer}
		<div class="tfoot">
			<slot name="footer" />
		</div>
	{/if}
	{#if $$slots.once}
		<div style="display: none">
			<slot name="once" />
		</div>
	{/if}
</div>
