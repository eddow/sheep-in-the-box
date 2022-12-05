<script lang="ts">
	import Column from '../../Column.svelte'
	import { getRowCtx } from '../../utils';
	import { Button, Icon, Spinner } from 'sveltestrap';
	import { Dialog, Editing, getEdtnCtx, type EditingRowContext, type Edition, type RowEditionContext } from '../utils';
	import { T } from '$lib/intl';
	import { DeleteCancel, confirm } from '$lib/globals';

	const { dialog } = getRowCtx<EditingRowContext>();
	const { editing, startEdit, cancelEdit, deleteRow, addRow, editModal } = getEdtnCtx<RowEditionContext>();
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	export let row: any;
	
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
		<Button type="button" class="prefix-icon" color="secondary" on:click={cancelEdit}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
		<Button type="submit" class="prefix-icon" color="primary"><Icon name="save" />{$T('cmd.save')}</Button>
		<slot name="dialog" adding={false} row={row} />
	{/if}
{:else if !dialog}
	<Column {row}>
		<div class="th" data-scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button size="sm" on:click={()=> addRow(creation())} color="success"><Icon name="plus" /></Button>{/if}
			{#if hasSpec(create, 'dialog')}<Button size="sm" on:click={()=> editModal(creation())} color="success"><Icon name="file-plus" /></Button>{/if}
			<slot name="header" />
		</div>
		<div class="th" class:editing={!!$editing} data-scope="row">
			{#if $editing == Editing.Working}
				<Spinner size="sm" />
			{:else if $editing}
				<Button size="sm" type="submit" color="primary"><Icon name="save" /></Button>
				<Button size="sm" type="button" on:click={cancelEdit} color="warning"><Icon name="x-lg" /></Button>
				<slot name="row" editing={true} row={$editing} />
				<slot name="edit-row" row={$editing} />
			{:else}
				{#if hasSpec(edition, 'row')}<Button size="sm" type="button" on:click={startEdit} color="secondary"><Icon name="pencil" /></Button>{/if}
				{#if hasSpec(edition, 'dialog')}<Button size="sm" type="button" on:click={()=> editModal(row)} color="secondary"><Icon name="box-arrow-up-left" /></Button>{/if}
				<Button size="sm" type="button" on:click={remove} color="danger"><Icon name="trash" /></Button>
				<slot name="row" editing={false} row={row} />
				<slot name="display-row" row={row} />
			{/if}
		</div>
	</Column>
{/if}