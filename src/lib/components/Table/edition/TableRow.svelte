<script lang="ts">
	import { getContext, setContext } from "svelte";
	import { Dialog, Editing, type EditingRowContext, type EditionControl } from "./utils";
	import { useCSR } from "$lib/utils";
	import { createForm } from "felte";
	import { validator } from '@felte/validator-yup';
	import { createEventDispatcher } from 'svelte';
	import { setFrmCtx, type FormAction, type FormContext } from "$lib/components/form/utils";
	import { setRowCtx } from "../utils";
	import Form from "$lib/components/form/Form.svelte";
	import { privateStore } from "$lib/privateStore";

	export let row: any;
	export let id: string|number;
	const editionControl = getContext<EditionControl>('edition'),
		{ addedRows, schema, cancelEdit, save, deleteRow } = editionControl;

	const dispatch = createEventDispatcher();

	const dataRow = typeof row !== 'string';
	// @ts-ignore
	export const formInfo = dataRow ? useCSR(()=> createForm({
		async onSubmit(values: any, context: any) {
			dispatch('submit', {values, context});
		},
		extend: validator({schema})
	})) : {form: null}, form = <FormAction>formInfo.form;
	if(dataRow) setFrmCtx(<FormContext>formInfo);
	const editing = privateStore<Editing>(addedRows.has(row) ? Editing.Yes : Editing.No);
	setRowCtx<EditingRowContext>({ dialog: Dialog.None, row, id});
	

	async function saveRow(e: CustomEvent) {
		editing.value = Editing.Working;
		editing.value = (await save(e.detail.values, row)) ? Editing.No : Editing.Yes;
	}
	
	setContext<EditionControl>('edition', {
		...editionControl,
		editing: editing.store,
		startEdit() {
			editing.value = Editing.Yes;
		},
		cancelEdit() {
			editing.value = Editing.No;
			cancelEdit(row);
		},
		async deleteRow() {
			let exEditing = editing.value;
			editing.value = Editing.Working;
			try {
				return await deleteRow(row);
			} finally {
				editing.value = exEditing;
			}
		}
	});
</script>
{#if dataRow && editing.value}
	<Form {schema} class="tr" data-row-id={''+id} {...$$restProps} on:submit={saveRow}>
		<slot />
	</Form>
{:else}
	<div class="tr" data-row-id={id} {...$$restProps}>
		<slot />
	</div>
{/if}