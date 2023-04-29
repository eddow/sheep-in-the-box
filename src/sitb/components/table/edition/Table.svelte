<script context="module" lang="ts">
	export type SaveCallback<T = any> = (oldValues: T, diff: Partial<T>) => Promise<any>;
	export type DeleteCallback<T = any> = (values: T) => Promise<boolean|void>;
</script>
<script lang="ts">
	import Table, { type RowModel } from "../Table.svelte";
	import ModalEdit from "./modal/ModalEdit.svelte";
	import type { TableEditionContext } from "./contexts";
	import { createEventDispatcher, type ComponentProps } from "svelte";

	type T = $$Generic;
	type keyT = string & keyof T;
	const TableT = Table<T>,
		ModalEditT = ModalEdit<T>;

	interface $$Props extends ComponentProps<Table<T>> {
		saveCB: SaveCallback;
		deleteCB?: DeleteCallback;
	}

	export let
		saveCB: SaveCallback,
		deleteCB: DeleteCallback | undefined = undefined,
		key: keyT | undefined = undefined,
		data: T[],
		context = {};
	let modalModel: T|undefined = undefined;
	const
		dispatch = createEventDispatcher(),
		edtnContext: Partial<TableEditionContext<T>> = {
			deletable: !!deleteCB,
			async save(old: T, diff: Partial<T>) {
				const rv = await saveCB(old, diff),
					model = <T>Object.assign(<Partial<T>>old, diff);
				if(rv !== undefined && key) model[key] = rv;
				const ndx = data.indexOf(old);
				if(~ndx) data[ndx] = model;
				else data = [model, ...data];
				dispatch('saved', {model, old});
			},
			async deleteRow(model: T) {
				console.assert(!!deleteCB, 'Delete called on non-deletable');
				if(await deleteCB!(model) === false)
					return false;
				const ndx = data.indexOf(model);
				if(~ndx)
					data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
				dispatch('deleted', model);
			},
			editModal(model: Partial<T>) {
				modalModel = <T>model;
			},
			...context
		};
	const rmCast = (x: any)=> (x as RowModel<T>);
</script>
<TableT {...$$props} bind:data {key} context={edtnContext} let:model>
	<slot model={rmCast(model)} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<svelte:fragment slot="once">
		<slot name="modal" model={modalModel}>
			<ModalEditT bind:model={modalModel}>
				<slot model={rmCast(modalModel)} />
			</ModalEditT>
		</slot>
		<slot name="once" />
	</svelte:fragment>
</TableT>