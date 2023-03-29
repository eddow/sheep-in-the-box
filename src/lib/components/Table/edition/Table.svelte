<script context="module" lang="ts">
	export type SaveCallback<T = any> = (oldValues: T, diff: Partial<T>) => Promise<any>;
	export type DeleteCallback<T = any> = (values: T) => Promise<boolean|void>;
</script>
<script lang="ts">
	import Table from "../Table.svelte";
	import ModalEdit from "./modal/ModalEdit.svelte";
	import type { TableEditionContext } from "./contexts";
	import type { ComponentProps } from "svelte";

	type T = $$Generic;
	type keyT = string & keyof T;
	const TableT = Table<T>;

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
	let modalModel: Partial<T>|undefined = undefined;
	const
		edtnContext: Partial<TableEditionContext<T>> = {
			...context,
			deletable: !!deleteCB,
			async save(old: T, diff: Partial<T>) {
				const rv = await saveCB(old, diff),
					row = <T>Object.assign(<Partial<T>>old, diff);
				if(rv !== undefined && key) row[key!] = rv;
				const ndxData = data.indexOf(old);
				if(~ndxData) data[ndxData] = row;
				else data = [row, ...data];
			},
			async deleteRow(row: T) {
				console.assert(!!deleteCB, 'Delete called on non-deletable');
				if(await deleteCB!(row) === false)
					return false;
				const ndx = data.indexOf(row);
				if(~ndx)
					data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
			},
			editModal(row: Partial<T>) {
				modalModel = row;
			}
		};
</script>
<TableT {...$$props} {data} {key} context={edtnContext} let:model>
	<slot {model} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<svelte:fragment slot="once">
		<slot name="modal" model={modalModel}>
			<ModalEdit bind:model={modalModel}>
				{#if modalModel}
					<slot model={modalModel} />
				{/if}
			</ModalEdit>
		</slot>
		<slot name="once" />
	</svelte:fragment>
</TableT>