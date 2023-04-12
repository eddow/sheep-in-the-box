<script lang="ts">
	import ModalPart from "./ModalPart.svelte";
	import { type Editing, getTblCtx, type TableEditionContext, setRowCtx } from "../contexts";
	import { privateStore } from "$sitb/privateStore";
	import { Buttons, ModalForm } from "svemantic";
	import { compare } from "$sitb/utils";

	type T = $$Generic<{}>;
	type keyT = string & keyof T;

	export let
		model: T|undefined;
		
	const
		{ save: tblSave } = getTblCtx<TableEditionContext>(),
		editingPrv = privateStore<Editing>(true),
		modelPrv = privateStore<T|undefined>(model);
	$: modelPrv.value = model;
	async function save(values: T) {
		const diff = compare(values, model);
		editingPrv.value = 'working';
		try {
			await tblSave(model!, diff);
		} finally {
			editingPrv.value = true;
		}
	}
	setRowCtx({model: modelPrv.store});
	// TODO Let `ModalForm` in `edition/Table`, managing `save` and only customize content
</script>
<ModalForm {save} huge bind:model>
	<slot name="header" slot="header" />
	<ModalPart dialog="body" editing={editingPrv.store}>
		<slot />
	</ModalPart>
	<Buttons slot="actions">
		<ModalPart dialog="actions" editing={editingPrv.store}>
			<slot name="actions">
				<slot />
			</slot>
		</ModalPart>
	</Buttons>
</ModalForm>