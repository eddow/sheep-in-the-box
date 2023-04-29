<script lang="ts">
	import type { RowModel } from "../../Table.svelte";

	import { Button, Cell, Form } from "svemantic";
	import { privateStore } from "$sitb/stores/privateStore";
	import Column from "../../Column.svelte";
	import { type Editing, setEdtnCtx, getTblCtx, type TableEditionContext, type ItemEditionContext } from "../contexts";
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
		const diff = compare(values, <T>model);
		if(diff) {
			editing.value = 'working';
			try {
				await save(<T>model, diff);
				editing.value = false;
			} catch(x) {
				editing.value = true;
				throw x;
			}
		} else editing.value = false;
	}

	interface $$Props extends ComponentProps<Column<T>> {}

	export let
		name: keyT|undefined = undefined,
		header: boolean = false,
		model: RowModel<T>;
	console.assert(name, 'Name is compulsory for cell-edit columns');
	const
		editing = privateStore<Editing>(false),
		{ save } = getTblCtx<TableEditionContext<T>>(),
		context: ItemEditionContext = {
			editing: editing.store,
			dialog: false,
			actions: CellAction
		};
	const value = (model: T)=> model[name!];
	const empty = (model: T)=> model[name!] === undefined;
	const uniqued = (model: T)=> ({[name!]: model[name!]});
	let form: ((...parms: any[])=> any)|undefined;
	$: context.form = form;
	setEdtnCtx(context);
	// Bug on blur->validate: field not found
	// TODO Esc->cancel-edit
</script>
<ColumnT {name} {header} let:title {...$$restProps} {model} let:model>
	<slot name="filter" slot="filter"><th></th></slot>
	<slot name="header" slot="header"><th scope="col">{title}</th></slot>
	<slot name="footer" slot="footer"><th scope="col" /></slot>
	{#if editing.value}
		<Form el="td" class="editor" tabular bind:form on:cancel={cancel} on:submit={submit} model={uniqued(model)}>
			<slot {model} {value} />
		</Form>
	{:else}
		<Cell {header} scope="row">
			<Button tiny on:click={startEdit} icon="edit outline" primary={empty(model)} />
			<slot {model} {value} {title} />
		</Cell>
	{/if}
</ColumnT>