<script lang="ts">
	import { Button, Cell, Form } from "svemantic";
	import { privateStore } from "$sitb/privateStore";
	import Column from "../../Column.svelte";
	import { type Editing, setEdtnCtx, getTblCtx, type TableEditionContext, getRowCtx, type ItemEditionContext, type RowContext } from "../contexts";
	import type { ComponentProps } from "svelte";
	import CellAction from "./CellAction.svelte";
	import { compare } from "$sitb/utils";

	type T = $$Generic;
	type keyT = string & keyof T;
	const ColumnT = Column<T>;

	function startEdit() {
		editing.value = true;
	}
	function cancel() {
		editing.value = false;
	}
	async function submit({detail: {values}}: CustomEvent<{values: T}>) {
		const mdl = $model, diff = compare(values, mdl);
		if(diff) {
			editing.value = 'working';
			try {
				await save(mdl, diff);
				editing.value = false;
			} catch(x) {
				editing.value = true;
				throw x;
			}
		}
	}

	interface $$Props extends ComponentProps<Column<T>> {}

	const
		rowCtx = getRowCtx<RowContext<T>>(),
		model = rowCtx?.model;

	export let
		name: keyT|undefined = undefined,
		header: boolean = false;
	// TODO? Have a prop-given `value` when `name` is undefined
	console.assert(name, 'Name is compulsory for cell-edit columns')
	let empty = false, uniqued: Partial<T> = {}, value: any;
	const
		editing = privateStore<Editing>(false),
		{ save } = getTblCtx<TableEditionContext<T>>(),
		context: ItemEditionContext = {
			editing: editing.store,
			dialog: false,
			actions: CellAction
		};
	$: empty = $model[name!] === undefined;
	$: value = $model[name!];
	$: uniqued = <Partial<T>>{[name!]: value};
	let form: ((...parms: any[])=> any)|undefined;
	$: context.form = form;
	setEdtnCtx(context);
	// Bug on blur->validate: field not found
	// TODO Esc->cancel
</script>
<ColumnT {name} {header} let:title {...$$restProps}>
	<slot name="filter" slot="filter"><th></th></slot>
	<slot name="header" slot="header"><th scope="col">{title}</th></slot>
	<slot name="footer" slot="footer"><th scope="col" /></slot>
	{#if editing.value}
		<Form el="td" class="editor" tabular bind:form on:cancel={cancel} on:submit={submit} model={uniqued}>
			<slot {model} {value} />
		</Form>
	{:else}
		<Cell {header} scope="row">
			<Button tiny on:click={startEdit} icon="edit outline" primary={empty} />
			<slot {model} {value} {title} />
		</Cell>
	{/if}
</ColumnT>