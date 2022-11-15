<script lang="ts">
	import Column from '../Column.svelte'
	import { getRowCtx, getTblCtx } from '../utils';
	import { Button, Icon } from 'sveltestrap';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { EditingRowContext } from './TableRow.svelte';
	import type { EditionModalControl } from './Table.svelte';

	const dispatch = createEventDispatcher();
	const {row, editing, dialog, id} = getRowCtx<EditingRowContext>();
	const modal = getContext<EditionModalControl>('modal');
	let backup: string | null;
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
		backup = null;
		editing.set(false);
	}
	function remove() {
		dispatch('remove', {value: row, id});
	}
	function add() {
		modal.add();
	}
</script>
{#if dialog === 'footer'}
	{#if id === null}
		<Button type="cancel" color="secondary"><Icon name="x-lg" />Cancel</Button>
		<Button type="reset" color="success"><Icon name="plus" />Create</Button>
	{:else}
		<Button type="cancel" color="secondary"><Icon name="x-lg" />Cancel</Button>
		<Button type="reset" color="primary"><Icon name="save" />Save</Button>
	{/if}
{:else if !dialog}
	<Column>
		<th scope="col" slot="header">
			<Button on:click={()=> add()} color="success"><Icon name="plus" /></Button>
		</th>
		<th class="edition" class:editing={$editing} scope="row">
			{#if $editing}
				<Button on:click={()=> save()} color="primary"><Icon name="save" /></Button>
				<Button on:click={()=> cancel()} color="warning"><Icon name="x-lg" /></Button>
			{:else}
				<Button on:click={()=> edit()} color="secondary"><Icon name="pencil" /></Button>
				<Button on:click={()=> remove()} color="danger"><Icon name="trash" /></Button>
			{/if}
		</th>
	</Column>
{/if}