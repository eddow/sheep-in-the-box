<script lang="ts">
	import Column from './Column.svelte'
	import {getRowCtx, getTblCtx} from './utils'
// TODO Re-check
	export let selection: Set<any>;
	let row: any;
	let all: 'indeterminate'|boolean;
	let selected: boolean;
	let data: any[];
	$: selected = selection.has(row);
	$: all = (selection.size === 0) ? false :
		(selection.size === data.length) ? true :
		'indeterminate';
	function onChangeOne(evt: Event) {
		selection[(evt.target as HTMLInputElement).checked?'add':'delete'](row);
		selection = new Set(selection);
	}
	function onChangeAll(evt: Event) {
		var hie = evt.target as HTMLInputElement;
		if(!hie.indeterminate)
			selection = new Set(hie.checked?data:[]);
	}
	getTblCtx().data.subscribe((v: any[])=> { data = v; });
</script>
<Column {row}>
	<div class="th" slot="header" data-scope="col">
		<input type="checkbox" checked={!!all} indeterminate={all === 'indeterminate'}
			on:change={onChangeAll} />
	</div>
	<div class="th" data-scope="row">
		<input type="checkbox" checked={selected} on:change={onChangeOne} />
	</div>
</Column>
