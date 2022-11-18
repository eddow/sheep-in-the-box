<script lang="ts">
	import Column from '../Column.svelte'
	import { getRowCtx } from '../utils';
	import { Button, Icon, Spinner } from 'sveltestrap';
	import { createEventDispatcher, getContext } from 'svelte';
	import { clone, compare, type EditingRowContext, type Edition, type EditionControl } from './utils';
	import { writable } from 'svelte/store';
	import { T } from '$lib/intl';
	import { DeleteCancel, confirm } from '$lib/globals';

	const dispatch = createEventDispatcher();
	const {row, editing, dialog, id} = getRowCtx<EditingRowContext>();
	const {modal: {close, add, edit}, rowCreation, editions} = getContext<EditionControl>('edition');
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	
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
	export let deleteConfirmation: ConfirmSpec | string = '';
	async function remove() {
		if(deleteConfirmation && !await confirm(deleteConfirmation, DeleteCancel))
			return;
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
			<Button type="button" class="prefix-icon" color="secondary" on:click={cancel}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
			<Button type="submit" class="prefix-icon" color="success" on:click={save}><Icon name="plus" />{$T('cmd.create')}</Button>
			<slot name="dialog" adding={true} row={$editing} />
		{:else}
			<Button type="button" class="prefix-icon" color="secondary" on:click={cancel}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
			<Button type="submit" class="prefix-icon" color="primary" on:click={save}><Icon name="save" />{$T('cmd.save')}</Button>
			<slot name="dialog" adding={false} row={$editing} />
		{/if}
	{/if}
{:else if !dialog}
	<Column>
		<div class="th" scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button on:click={()=> addRow()} color="success"><Icon name="plus" /></Button>{/if}
			{#if hasSpec(create, 'dialog')}<Button on:click={()=> add(creation())} color="success"><Icon name="file-plus" /></Button>{/if}
			<slot name="header" />
		</div>
		<div class="th" class:editing={!!$editing} scope="row">
			{#if working}<Spinner size="sm" />{:else}
				{#if $editing}
					<Button on:click={save} color="primary"><Icon name="save" /></Button>
					<Button on:click={cancel} color="warning"><Icon name="x-lg" /></Button>
					<slot name="row" editing={true} row={$editing} />
					<slot name="edit-row" row={$editing} />
				{:else}
					{#if hasSpec(edition, 'row')}<Button on:click={editRow} color="secondary"><Icon name="pencil" /></Button>{/if}
					{#if hasSpec(edition, 'dialog')}<Button on:click={modalEdit} color="secondary"><Icon name="box-arrow-up-left" /></Button>{/if}
					<Button on:click={remove} color="danger"><Icon name="trash" /></Button>
					<slot name="row" editing={false} row={row} />
					<slot name="display-row" row={row} />
				{/if}
			{/if}
		</div>
	</Column>
{/if}