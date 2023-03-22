<script context="module" lang="ts">
	export type SaveCallback<V=any, R=any> = (prop: string, value: V, oldValues: R) => Promise<boolean|undefined|unknown>;
</script>
<script lang="ts">
	import { Button, Buttons, Field, Form, FormModule, Input, Loader } from "svemantic";
	import { privateStore } from "$sitb/privateStore";
	import Column from "../../Column.svelte";
	import { setRowCtx } from "../../utils";
	import { Dialog, Editing, setEdtnCtx, type EditingRowContext } from "../utils";

	type T = $$Generic;
	type keyT = string & keyof T;
	const ColumnT = Column<T>;

	export let saveCB: SaveCallback;
	export let prop: keyT;
	export let header: boolean = false;
	export let row: T;
	// TODO Manage type for cell-edit & validate - idea: slot in <Input> & manage w/ saveCB
	let empty = false, editingValue: T[keyT];
	setRowCtx<EditingRowContext>({row, dialog: Dialog.Wrapped});
	$: empty = row[prop] === undefined;
	const editing = privateStore<Editing>(Editing.No);
	setEdtnCtx({
		editing: editing.store
	});
	function startEdit() {
		editing.value = Editing.Yes;
		editingValue = row[prop];
	}
	function cancelEdit() {
		editing.value = Editing.No;
	}
	async function submit() {
		editing.value = Editing.Working;
		if(editingValue === row[prop] || false !== await saveCB(prop, editingValue, row)) {
			row[prop] = editingValue;
			editing.value = Editing.No;
		} else
			editing.value = Editing.Yes;
	}
	// Bug on blur->validate: field not found
	// TODO Esc->cancel
</script>
<ColumnT {prop} {header} {...$$restProps}>
	<slot name="filter" slot="filter" />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	{#if editing.value}
		<td>
			<Input autofocus primary tabular name={prop} bind:value={editingValue}>
				<svelte:fragment slot="left-action">
					<Button tiny color="yellow" on:click={cancelEdit} icon="times" />
					<Button tiny primary on:click={submit} icon="save outline" />
					<Loader inverted loading={editing.value === Editing.Working} />
				</svelte:fragment>
			</Input>
		</td>
	{:else}
		<td>
			<Buttons>
				<Button tiny on:click={startEdit} icon="edit outline" primary={empty} />
			</Buttons>
			<slot {row} value={row[prop]} />
		</td>
	{/if}
</ColumnT>