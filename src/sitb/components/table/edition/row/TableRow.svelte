<script lang="ts">
	import { type RowEditionContext, getTblCtx, type AddableEditionContext, type Editing, setEdtnCtx, setRowCtx } from "./contexts";
	import { privateStore } from "$sitb/stores/privateStore";
	import { Form, Tr } from "svemantic";
	import { compare } from "$sitb/utils";

	type T = $$Generic;

	export let
		model: T;
	const
		FormT = Form<T>,
		{ save, deleteRow, added, endEdit } = getTblCtx<AddableEditionContext<T>>();
	const	// Weird but need 2 `const` declaration for `added` to be in scope
		editingPrv = privateStore<Editing>($added.includes(model)),
		editing = editingPrv.store,
		modelPrv = privateStore<T|symbol>(model);
	$: modelPrv.value = model;
	setRowCtx<T|symbol>(modelPrv.store);
	let adding: boolean;
	$: adding = $added.includes(model);

	async function saveRow({detail: {values}}: CustomEvent<{values: T}>) {
		const diff = adding ? values : compare(values, model);
		if(!diff) return;
		editingPrv.value = 'working';
		try {
			endEdit(model, true);	// endEdit b4 save !important : remove from `added` before adding to `data`
			await save(model, diff);
			editingPrv.value = false;
		} catch(x) {
			editingPrv.value = true;
			throw x;
		}
	}
	
	function cancelRowEdit() {
		editingPrv.value = false;
		endEdit(model, false);
	}

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
	<FormT tabular
		positive={adding} class="edition"
		{...$$restProps} on:submit={saveRow} on:cancel={cancelRowEdit}
		{model}
	>
		<slot {model} />
	</FormT>
{:else}
	<Tr {...$$restProps}>
		<slot {model} />
	</Tr>
{/if}