<script lang="ts">
	import { Dialog, Editing, getEdtnCtx, setEdtnCtx, type EditingRowContext, type RowEditionContext } from "../utils";
	import { setRowCtx } from "../../utils";
	import { privateStore } from "$sitb/privateStore";
	import { Form } from "svemantic";

	type T = $$Generic;

	export let row: T;
	const EditionContext = getEdtnCtx<RowEditionContext>(),
		{ addedRows, cancelEdit, save, deleteRow } = EditionContext;

	let adding = addedRows.has(row);
	const dataRow = typeof row !== 'string',
		editing = privateStore<Editing>(adding ? Editing.Yes : Editing.No),
		rowStore = privateStore<T>(row);
	$: adding = addedRows.has(row);
	$: rowStore.value = row;
	setRowCtx<EditingRowContext>({row: rowStore.store, dialog: Dialog.None});
	async function saveRow(e: CustomEvent) {
		editing.value = Editing.Working;
		editing.value = (await save(e.detail.values, row)) ? Editing.No : Editing.Yes;
	}
	
	setEdtnCtx<RowEditionContext>({
		...EditionContext,
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
	<Form tabular primary={editing && !adding} positive={adding} class="edition" {...$$restProps} on:submit={saveRow}>
		<slot {row} />
	</Form>
{:else}
	<tr {...$$restProps}>
		<slot {row} />
	</tr>
{/if}