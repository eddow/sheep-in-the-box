<script lang="ts">
	import { privateStore } from '$sitb/privateStore';
	import { specialRow, getTblCtx, setClmnCtx, type ColumnContext, getRowCtx, type RowContext, setCellCtx, getCellCtx } from './contexts'
	import { I } from '$sitb/globals';
	import { Cell } from 'svemantic';
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
	<td class="error message">`Column` is to be used in a `Table` only</td>
{:else if $model === specialRow.filter}
	<slot name="filter">
		<th></th>
	</slot>
{:else if $model === specialRow.header}
	<slot name="header">
		<th scope="col">{titlePrv.value}</th>
	</slot>
{:else if $model === specialRow.footer}
	<slot name="footer"><th scope="col" /></slot>
{:else}
	<slot model={$model} value={value === undefined ? name && $model[name] : value} title={titlePrv.value}>
		<Cell {header} scope="row" {collapsing}>
			<CellDisplay />
		</Cell>
	</slot>
{/if}
<style lang="scss" global>
	td.editor {
		padding: 0 !important;
	}
	td.ui.form, .ui.form td {
		.field {
			margin: 0;
		}
	}
</style>
