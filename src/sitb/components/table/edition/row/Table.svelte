<script lang="ts">
	import type { RowModel } from "../../Table.svelte";

	import TableRow from "./TableRow.svelte";
	import Table, { type SaveCallback } from "../Table.svelte";
	import type { AddableEditionContext } from "./contexts";
	import { privateStore } from "$sitb/stores/privateStore";
	import { createEventDispatcher, type ComponentProps } from "svelte";

	type T = $$Generic;
	type keyT = string & keyof T;
	const TableT = Table<T>;
	
	interface $$Props extends ComponentProps<Table<T>> {}

	export let
		saveCB: SaveCallback,
		context: any = {},
		data: T[],
		key: keyT = <keyT>'undefined';

	let addedPrv = privateStore<Partial<T>[]>([]);
	const
		dispatch = createEventDispatcher(),
		edtnContext: AddableEditionContext<T> = {
			...context,
			added: addedPrv.store,
			add(model: Partial<T> = {}) {
				addedPrv.value = [model, ...addedPrv.value];
			},
			endEdit(model: T, saved: boolean) {
				const ndx = addedPrv.value.indexOf(model);
				if(!saved && ~ndx)	// cancel added => remove from added
					addedPrv.value = [...addedPrv.value.slice(0, ndx), ...addedPrv.value.slice(ndx+1)];
			}
		};
	function rowDeleted({detail}: CustomEvent<T>) {
		const ndx = data.indexOf(detail);
		if(~ndx)
			data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
		//? delete "added"
		dispatch('deleted', detail)
	}
	function rowSaved({detail: {model, old}}: CustomEvent<{model: T, old: T}>) {
		const ndx = addedPrv.value.indexOf(model);
		if(~ndx) {	// saved added => remove from added and get in data
			addedPrv.value = [...addedPrv.value.slice(0, ndx), ...addedPrv.value.slice(ndx+1)];
			data = [model, ...data];
		} else {
			const dndx = data.indexOf(old);
			console.assert(~dndx, 'Saved row existed');
			data[dndx] = model;
		}
		dispatch('saved', {model, old});
	}
	const castry = (x: Partial<T>[])=> x as T[];
</script>
<TableT {saveCB} key={key} {...$$props} data={castry([...addedPrv.value, ...data])}
	rowType={TableRow} unfiltered={castry(addedPrv.value)} context={edtnContext}
	let:model on:deleted={rowDeleted} on:saved={rowSaved}
>
	<slot {model} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<slot name="once" slot="once" />
</TableT>