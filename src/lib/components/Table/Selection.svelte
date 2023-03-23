<script lang="ts">
	import { Th } from 'svemantic';
	import Column from './Column.svelte'
	import { getRowCtx, getTblCtx, type RowContext } from './utils'
// TODO Re-check
	type T = $$Generic;
	export let selection: Set<T>;
	const row = getRowCtx<RowContext>()?.row;
	let all: 'indeterminate'|boolean;
	let selected: boolean;
	let data: T[];
	$: selected = selection.has($row);
	$: all = (selection.size === 0) ? false :
		(selection.size === data.length) ? true :
		'indeterminate';
	function onChangeOne(evt: Event) {
		selection[(evt.target as HTMLInputElement).checked?'add':'delete']($row);
		selection = new Set(selection);
	}
	function onChangeAll(evt: Event) {
		var hie = evt.target as HTMLInputElement;
		if(!hie.indeterminate)
			selection = new Set(hie.checked?data:[]);
	}
	getTblCtx().data.subscribe((v: T[])=> { data = v; });
</script>
<Column>
	<Th slot="header" scope="col">
		<input type="checkbox" checked={!!all} indeterminate={all === 'indeterminate'}
			on:change={onChangeAll} />
	</Th>
	<Th scope="row">
		<input type="checkbox" checked={selected} on:change={onChangeOne} />
	</Th>
</Column>
