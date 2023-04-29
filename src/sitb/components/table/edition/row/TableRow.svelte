<script lang="ts">
	import { type RowEditionContext, getTblCtx, type AddableEditionContext, type Editing, setEdtnCtx } from "./contexts";
	import { privateStore } from "$sitb/stores/privateStore";
	import { Form } from "svemantic";
	import { compare } from "$sitb/utils";

	type T = $$Generic;

	const FormT = Form<T>;

	export let
		model: T;
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
	<tr {...$$restProps}>
		<slot {model} />
	</tr>
{/if}