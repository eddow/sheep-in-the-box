<script lang="ts">
	import TableRow from './TableRow.svelte'
	import { specialRow, setTblCtx } from './utils'
  	import { exclude } from './utils/exclude'
  	import { prefixFilter } from './utils/prefixFilter'
	import { Table } from 'sveltestrap';
	import { privateStore, type PrivateStore } from '$lib/privateStore';

	export let columnFilters: boolean = false;
	export let columnHeaders: boolean = true;
	export let columnFooters: boolean = false;
	export let filters = new Map<any, (row: any)=> boolean>();
	export let rowType = TableRow;
	export let data: any[];
	export let unfiltered: any[] = [];
	const dataStore = privateStore(data);
$:	dataStore.value = data;
	setTblCtx({
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
</script>
<Table {...exclude($$props, ['use', 'tr$'])}>
	{#if columnHeaders}
		<thead>
			<svelte:component this={rowType} id="header" row={specialRow.header} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.header} />
			</svelte:component>
		</thead>
	{/if}
	{#if columnFilters}
		<thead>
			<svelte:component this={rowType} id="filter" row={specialRow.filter} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.filter} />
			</svelte:component>
		</thead>
	{/if}
	<tbody>
		{#each displayedData as row, ndx (rowId(row) || ndx)}
			<svelte:component this={rowType} id={rowId(row)} row={row} {...prefixFilter($$props, 'tr$')}>
				<slot row={row} />
			</svelte:component>
		{/each}
	</tbody>
	{#if columnFooters}
		<tfoot>
			<svelte:component this={rowType} id="footer" row={specialRow.footer} {...prefixFilter($$props, 'tr$')}>
				<slot row={specialRow.footer} />
			</svelte:component>
		</tfoot>
	{/if}
	{#if $$slots.once}
		<tr style="display: none">
			<td>
					<slot name="once" />
			</td>
		</tr>
	{/if}
</Table>
