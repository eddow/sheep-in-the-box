<script lang="ts">
	import { type RowEditionContext, getTblCtx, type AddableEditionContext, type Editing, setEdtnCtx, setRowCtx } from "./contexts";
	import { privateStore } from "$sitb/privateStore";
	import { Form } from "svemantic";
	import { compare } from "$sitb/utils";

	type T = $$Generic;

	export let
		model: T,
		context: any = {};
	const editionContext = getTblCtx<AddableEditionContext<T>>(),
		{ save, deleteRow, added, endEdit } = editionContext;
	const editing = privateStore<Editing>($added.includes(model));
	let adding: boolean;
	$: adding = $added.includes(model);

	async function saveRow({detail: {values}}: CustomEvent<{values: T}>) {
		const diff = adding ? values : compare(values, model);
		editing.value = 'working';
		try {
			await save(model, diff);
			editing.value = false;
			endEdit(model, true);
			// TODO: Ne stoppe pas l'éditopn
		} catch(x) {
			editing.value = true;
			throw x;
		}
	}
	
	function cancelRowEdit() {
		editing.value = false;
		endEdit(model, false);
	}

	const modelPrv = privateStore<T>(model);
	$: modelPrv.value = model;
	setRowCtx({model: modelPrv.store, ...context});
	setEdtnCtx<RowEditionContext>({
		dialog: false,
		editing: editing.store,
		startEdit() {
			editing.value = true;
		},
		async deleteRow() {
			let exEditing = editing.value;
			editing.value = 'working';
			try { await deleteRow!(model); }
			finally { editing.value = exEditing; }
		}
	});
</script>
{#if editing.value}
	<Form tabular
		primary={editing.value && !adding} positive={adding} class="edition"
		{...$$restProps} on:submit={saveRow} on:cancel={cancelRowEdit}
	>
		<slot {model} />
	</Form>
{:else}
	<tr {...$$restProps}>
		<slot {model} />
	</tr>
{/if}