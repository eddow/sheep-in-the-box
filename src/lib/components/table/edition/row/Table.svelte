<script lang="ts">
	import TableRow from "./TableRow.svelte";
	import Table, { type SaveCallback } from "../Table.svelte";
	import type { AddableEditionContext } from "./contexts";
	import { privateStore } from "$sitb/privateStore";
	import { model } from "mongoose";

	type T = $$Generic;//<{}>;
	type keyT = string & keyof T;
	const TableT = Table<T>;

	export let
		saveCB: SaveCallback,
		context: any = {},
		data: T[],
		key: keyT;

	let addedPrv = privateStore<Partial<T>[]>([]);
	
	const
		edtnContext: AddableEditionContext<T> = {
			...context,
			added: addedPrv.store,
			add(model: Partial<T> = {}) {
				addedPrv.value = [model, ...addedPrv.value];
			},
			endEdit(model: T, saved: boolean) {
				const ndx = addedPrv.value.indexOf(model);
				if(~ndx) {
					addedPrv.value = [...addedPrv.value.slice(0, ndx), ...addedPrv.value.slice(ndx+1)];
					if(saved) data = [model, ...data];
				}
			}
		};
	function rowDeleted(e: CustomEvent<T>) {
		const ndx = data.indexOf(e.detail);
		debugger;
		if(~ndx)
			data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
	}
	const castry = (x: Partial<T>[])=> <T[]>x;
</script>
<TableT {saveCB} key={key} {...$$props} data={castry([...addedPrv.value, ...data])}
	rowType={TableRow} unfiltered={castry(addedPrv.value)} context={edtnContext}
	let:model on:deleted={rowDeleted}
>
	<slot {model} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<slot name="once" slot="once" />
</TableT>