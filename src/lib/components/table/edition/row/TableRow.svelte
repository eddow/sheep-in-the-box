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
		let t = 0;
	const	// Weird but need 2 `const` declaration
		editingPrv = privateStore<Editing>($added.includes(model)),
		editing = editingPrv.store;
		
	let adding: boolean;
	$: {
		adding = $added.includes(model);
	}

	async function saveRow({detail: {values}}: CustomEvent<{values: T}>) {
		const diff = adding ? values : compare(values, model);
		editingPrv.value = 'working';
		try {
			endEdit(model, true);	// endEdit b4 save !important : remove from `added` before adding to `data`
			await save(model, diff);
			editingPrv.value = false;
			// TODO: Ne stoppe pas l'éditopn
		} catch(x) {
			editingPrv.value = true;
			throw x;
		}
	}
	
	function cancelRowEdit() {
		editingPrv.value = false;
		endEdit(model, false);
	}

	const modelPrv = privateStore<T>(model);
	$: modelPrv.value = model;
	setRowCtx({model: modelPrv.store, ...context});
	setEdtnCtx<RowEditionContext>({
		dialog: false,
		editing,
		startEdit() {
			editingPrv.value = true;
		},
		async deleteRow() {
			let exEditing = editingPrv.value;
			editingPrv.value = 'working';
			try { await deleteRow!(model); }
			finally { editingPrv.value = exEditing; }
		}
	});
</script>
{#if $editing || adding}
	<Form tabular
		primary={!adding} positive={adding} class="edition"
		{...$$restProps} on:submit={saveRow} on:cancel={cancelRowEdit}
	>
		<slot {model} />
	</Form>
{:else}
	<tr {...$$restProps}>
		<slot {model} />
	</tr>
{/if}