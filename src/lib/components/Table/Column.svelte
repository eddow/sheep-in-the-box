<script lang="ts">
	import { privateStore } from '$sitb/privateStore';
	import { specialRow, getTblCtx, setClmnCtx, type ColumnContext, getRowCtx, type RowContext, setCellCtx, getCellCtx } from './contexts'
	import { I } from '$sitb/globals';
	import { Cell, Td, Th } from 'svemantic';
	import CellDisplay from './CellDisplay.svelte';

	type T = $$Generic;
	type keyT = keyof T & string;

	const ungivenValue = {};	// unique constant

	export let
		name: keyT|undefined = undefined,
		title: string|true = true,
		header: boolean = false,
		controls: ConstructorOfATypedSvelteComponent|undefined = undefined,
		collapsing: boolean = false,
		html: ((row: any)=> boolean)|boolean = false,
		getDisplay = (x: any, row: any)=> x?.toString() || '',
		value: any = ungivenValue,
		cellContext: any = {};
	let field = privateStore({name});
	const tblSetFilter = getTblCtx().setFilter,
		titlePrv = privateStore<string>(),
		valuePrv = privateStore<any>(),
		rowCtx = getRowCtx<RowContext<T>>(),
		model = rowCtx?.model,
		// TODO : one name/id per column, one columnContext / (table * clmn)
		context: ColumnContext<T> = {
			setFilter(filter: (name: any)=> boolean) {
				console.assert(!!name, 'A filtered column must define a `name`')
				tblSetFilter(name, filter && ((model: any)=> filter(model[name])));
			},
			controls,
			html,
			getDisplay,
			header,
			field: field.store,
			title: titlePrv.store
		};
	setClmnCtx(context);
	$: field.value = {name, text: $I(`fld.${name||'unnamed'}`)};
	$: titlePrv.value = title === true ? field.value.text : title;
	$: valuePrv.value = value === ungivenValue ? name !== undefined ? $model[name] : undefined : value;
	setCellCtx({ value: valuePrv.store, ...cellContext });
</script>
{#if !rowCtx}
	<Td class="error message">`Column` is to be used in a `Table` only</Td>
{:else if $model === specialRow.filter}
	<slot name="filter">
		<Th></Th>
	</slot>
{:else if $model === specialRow.header}
	<slot name="header" title={titlePrv.value}>
		<Th scope="col">{titlePrv.value}</Th>
	</slot>
{:else if $model === specialRow.footer}
	<slot name="footer">
		<Th scope="col" />
	</slot>
{:else}
	<slot row={$model} value={value === undefined ? name && $model[name] : value}>
		<Cell {header} scope="row" {collapsing}>
			<CellDisplay />
		</Cell>
	</slot>
{/if}
