<script lang="ts">
	import ModalPart from "./ModalPart.svelte";
	import { type Editing, getTblCtx, type TableEditionContext } from "../contexts";
	import { privateStore } from "$sitb/stores/privateStore";
	import { Buttons, ModalForm } from "svemantic";
	import { compare } from "$sitb/utils";

	type T = $$Generic;

	export let
		model: T|undefined;
		
	const
		{ save: tblSave } = getTblCtx<TableEditionContext>(),
		editingPrv = privateStore<Editing>(true)
	async function save(values: T) {
		const diff = compare(values, <T>model);
		if(!diff) return;
		editingPrv.value = 'working';
		try {
			await tblSave(model!, diff);
		} finally {
			editingPrv.value = true;
		}
	}
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