<script lang="ts">
	import Column from '../Column.svelte'
	import { getRowCtx } from '../utils';
	import { Button, Icon, Spinner } from 'sveltestrap';
	import { Dialog, Editing, getEdtnCtx, type EditingRowContext, type Edition } from './utils';
	import { T } from '$lib/intl';
	import { DeleteCancel, confirm } from '$lib/globals';

	const { row, dialog, id } = getRowCtx<EditingRowContext>();
	const { editing, startEdit, cancelEdit, deleteRow, addRow, editModal } = getEdtnCtx();
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	
	function hasSpec(e: Edition, spec: Edition) {
		return <string>e in {[<string>spec]: 1, both: 1};
	}
	export let deleteConfirmation: ConfirmSpec | string = '';
	async function remove() {
		if(deleteConfirmation && !await confirm(deleteConfirmation, DeleteCancel))
			return;
		await deleteRow();
	}
</script>
{#if dialog === Dialog.Footer}
	{#if $editing == Editing.Working}<Spinner size="sm" />{:else}
		{#if id === null}
			<Button type="button" class="prefix-icon" color="secondary" on:click={cancelEdit}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
			<Button type="submit" class="prefix-icon" color="success"><Icon name="plus" />{$T('cmd.create')}</Button>
			<slot name="dialog" adding={true} row={row} />
		{:else}
			<Button type="button" class="prefix-icon" color="secondary" on:click={cancelEdit}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
			<Button type="submit" class="prefix-icon" color="primary"><Icon name="save" />{$T('cmd.save')}</Button>
			<slot name="dialog" adding={false} row={row} />
		{/if}
	{/if}
{:else if !dialog}
	<Column>
		<th scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button on:click={()=> addRow(creation())} color="success"><Icon name="plus" /></Button>{/if}
			{#if hasSpec(create, 'dialog')}<Button on:click={()=> editModal(creation())} color="success"><Icon name="file-plus" /></Button>{/if}
			<slot name="header" />
		</th>
		<th class:editing={!!$editing} scope="row">
			{#if $editing == Editing.Working}<Spinner size="sm" />{:else}
				{#if $editing}
					<Button type="submit" color="primary"><Icon name="save" /></Button>
					<Button type="button" on:click={cancelEdit} color="warning"><Icon name="x-lg" /></Button>
					<slot name="row" editing={true} row={$editing} />
					<slot name="edit-row" row={$editing} />
				{:else}
					{#if hasSpec(edition, 'row')}<Button type="button" on:click={startEdit} color="secondary"><Icon name="pencil" /></Button>{/if}
					{#if hasSpec(edition, 'dialog')}<Button type="button" on:click={()=> editModal(row)} color="secondary"><Icon name="box-arrow-up-left" /></Button>{/if}
					<Button type="button" on:click={remove} color="danger"><Icon name="trash" /></Button>
					<slot name="row" editing={false} row={row} />
					<slot name="display-row" row={row} />
				{/if}
			{/if}
		</th>
	</Column>
{/if}