<script lang="ts">
	import { privateStore } from '$sitb/stores/privateStore';
	import { getTblCtx, setClmnCtx, type ColumnContext, specialRow, getRowCtx } from './contexts'
	import { I } from '$sitb/globals';
	import { Cell } from 'svemantic';
	import CellDisplay from './CellDisplay.svelte';

	type T = $$Generic;
	type keyT = keyof T & string;

	export let
		name: keyT|undefined = undefined,
		title: string|true = true,
		header: boolean = false,
		controls: ConstructorOfATypedSvelteComponent|undefined = undefined,
		collapsing: boolean = false,
		html: ((model: any)=> boolean)|boolean = false,
		getDisplay = (x: any, model: any)=> x?.toString() || '';
	const
		tblSetFilter = getTblCtx().setFilter,
		titlePrv = privateStore<string>(),
		textPrv = privateStore<string>(),
		field = name === undefined ? undefined : {name, text: textPrv.store},
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
			field,
			title: titlePrv.store
		},
		model = getRowCtx<T|symbol>();
	setClmnCtx(context);
	$: textPrv.value = $I(`fld.${name||'unnamed'}`);
	$: titlePrv.value = title === true ? textPrv.value : title;
	const cast =(x: T|symbol)=> x as T;
</script>
{#if !tblSetFilter}
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
{:else if model !== undefined}
	<slot model={cast($model)} title={titlePrv.value}>
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
