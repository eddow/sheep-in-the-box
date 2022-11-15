<script lang="ts">
	import Column from '../Column.svelte'
	import { getRowCtx, getTblCtx } from '../utils';
	import { Button, Icon } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import type { EditingContext } from './TableRow.svelte';

	const dispatch = createEventDispatcher();
	const rowCtx = getRowCtx<EditingContext>(), row = rowCtx.row, editing = rowCtx.editing
	let backup: string |null;
	function edit() {
		backup = JSON.stringify(row);
		editing.set(true);
	}
	function save() {
		if(dispatch('save', {value: row, old: JSON.parse(<string>backup)}, {cancelable: true})) {
			backup = null;
			editing.set(false);
		}
	}
	function cancel() {
		for(let k of Object.keys(row))
			delete row[k];
		Object.assign(row, JSON.parse(<string>backup));
		editing.set(false);
	}
	function remove() {
		dispatch('remove', {value: row, id: rowCtx.id});
	}
</script>
<Column>
	<th class="edition" class:editing={$editing} scope="row">
		{#if $editing}
			<Button on:click={()=> save()} color="success"><Icon name="save" /></Button>
			<Button on:click={()=> cancel()} color="warning"><Icon name="x-lg" /></Button>
		{:else}
			<Button on:click={()=> edit()} color="primary"><Icon name="pencil" /></Button>
			<Button on:click={()=> remove()} color="danger"><Icon name="trash" /></Button>
		{/if}
	</th>
</Column>
