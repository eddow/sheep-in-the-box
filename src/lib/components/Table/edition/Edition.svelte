<script lang="ts">
	import Column from '../Column.svelte'
	import { getRowCtx } from '../utils';
	import { Button, Icon, Spinner } from 'sveltestrap';
	import { createEventDispatcher, getContext } from 'svelte';
	import { clone, compare, type EditingRowContext, type Edition, type EditionControl } from './utils';
	import { writable } from 'svelte/store';
	const dispatch = createEventDispatcher();
	const {row, editing, dialog, id} = getRowCtx<EditingRowContext>();
	const {modal: {close, add, edit}, rowCreation, editions} = getContext<EditionControl>('edition');
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	// TODO Deletion warning text
	function hasSpec(e: Edition, spec: Edition) {
		return <string>e in {[<string>spec]: 1, both: 1};
	}

	function editRow() {
		editing.set(clone(row));
		editions.set(row, editing);
	}
	function stopEdition() {
		if(dialog) close(); else editing.set(null);
	}
	function addRow() {
		rowCreation.add(creation());
	}
	let working = false;
	function save() {
		const diff = compare($editing, row);
		function effect(reviewed?: any) {
			if(diff) rowCreation.save(reviewed || $editing, row);
			stopEdition();
			working = false;
		}
		function cancel() {
			working = false;
		}
		working = true;
		if(!diff || dispatch('save', {row: $editing, old: row, diff, effect, cancel}, {cancelable: true}))
			effect();
	}
	function cancel() {
		rowCreation.cancel(row);
		stopEdition();
	}
	function remove() {
		function effect() {
			rowCreation.delete(row);
			working = false;
		}
		function cancel() {
			working = false;
		}
		working = true;
		if(dispatch('remove', {row, id, effect, cancel}, {cancelable: true}))
			effect();
	}
	function modalEdit() {
		edit(writable(clone(row)), row, id);
	}
</script>
{#if dialog === 'footer'}
	{#if working}<Spinner size="sm" />{:else}
		{#if id === null}
			<Button type="reset" color="secondary" on:click={cancel}><Icon name="x-lg" />Cancel</Button>
			<Button type="submit" color="success" on:click={save}><Icon name="plus" />Create</Button>
		{:else}
			<Button type="reset" color="secondary" on:click={cancel}><Icon name="x-lg" />Cancel</Button>
			<Button type="submit" color="primary" on:click={save}><Icon name="save" />Save</Button>
		{/if}
	{/if}
{:else if !dialog}
	<Column>
		<th scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button on:click={()=> addRow()} color="success"><Icon name="plus" /></Button>{/if}
			{#if hasSpec(create, 'dialog')}<Button on:click={()=> add(creation())} color="success"><Icon name="file-plus" /></Button>{/if}
		</th>
		<th class="edition" class:editing={!!$editing} scope="row">
			{#if working}<Spinner size="sm" />{:else}
				{#if $editing}
					<Button on:click={()=> save()} color="primary"><Icon name="save" /></Button>
					<Button on:click={()=> cancel()} color="warning"><Icon name="x-lg" /></Button>
				{:else}
					{#if hasSpec(edition, 'row')}<Button on:click={()=> editRow()} color="secondary"><Icon name="pencil" /></Button>{/if}
					{#if hasSpec(edition, 'dialog')}<Button on:click={()=> modalEdit()} color="secondary"><Icon name="box-arrow-up-left" /></Button>{/if}
					<Button on:click={()=> remove()} color="danger"><Icon name="trash" /></Button>
				{/if}
			{/if}
		</th>
	</Column>
{/if}