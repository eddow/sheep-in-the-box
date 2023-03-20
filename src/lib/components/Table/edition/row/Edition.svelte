<script lang="ts">
	import Column from '../../Column.svelte'
	import { getRowCtx, getTblCtx } from '../../utils';
	import { Button as StrpButton, Icon, Spinner } from 'sveltestrap';
	import { Dialog, Editing, getEdtnCtx, type EditingRowContext, type EditingTableContext, type Edition, type RowEditionContext } from '../utils';
	import { T } from '$lib/intl';;
	import { Popup, Button, toast } from 'svemantic';

	const { dialog } = getRowCtx<EditingRowContext>();
	const { editing, startEdit, cancelEdit, deleteRow, addRow, editModal } = getEdtnCtx<RowEditionContext>();
	const { deletable } = getTblCtx<EditingTableContext>();
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	export let row: any;
	
	function hasSpec(e: Edition, spec: Edition) {
		return <string>e in {[<string>spec]: 1, both: 1};
	}
	export let deleteConfirmation: string = '';
	async function remove(skipConf: boolean = false) {
		if(deleteConfirmation && !skipConf)
			return;
		toast({message: 'DELETION!', class: 'error'});
		//await deleteRow();
	}
</script>
{#if dialog === Dialog.Footer}
	{#if $editing == Editing.Working}<Spinner size="sm" />{:else}
		<StrpButton type="StrpButton" class="prefix-icon" color="secondary" on:click={cancelEdit}><Icon name="x-lg" />{$T('cmd.cancel')}</StrpButton>
		<StrpButton type="submit" class="prefix-icon" color="primary"><Icon name="save" />{$T('cmd.save')}</StrpButton>
		<slot name="dialog" adding={false} row={row} />
	{/if}
{:else if !dialog}
	<Column {row}>
		<div class="th" data-scope="col" slot="header">
			{#if hasSpec(create, 'row')}<StrpButton size="sm" on:click={()=> addRow(creation())} color="success"><Icon name="plus" /></StrpButton>{/if}
			{#if hasSpec(create, 'dialog')}<StrpButton size="sm" on:click={()=> editModal(creation())} color="success"><Icon name="file-plus" /></StrpButton>{/if}
			<slot name="header" />
		</div>
		<div class="th" class:editing={!!$editing} data-scope="row">
			{#if $editing == Editing.Working}
				<Spinner size="sm" />
			{:else if $editing}
				<StrpButton size="sm" type="submit" color="primary"><Icon name="save" /></StrpButton>
				<StrpButton size="sm" type="StrpButton" on:click={cancelEdit} color="warning"><Icon name="x-lg" /></StrpButton>
				<slot name="row" editing={true} row={$editing} />
				<slot name="edit-row" row={$editing} />
			{:else}
				{#if hasSpec(edition, 'row')}<StrpButton size="sm" type="StrpButton" on:click={startEdit} color="secondary"><Icon name="pencil" /></StrpButton>{/if}
				{#if hasSpec(edition, 'dialog')}<StrpButton size="sm" type="StrpButton" on:click={()=> editModal(row)} color="secondary"><Icon name="box-arrow-up-left" /></StrpButton>{/if}
				{#if deletable}
					<StrpButton size="sm" type="StrpButton" on:click={()=> remove()} color="danger"><Icon name="trash" /></StrpButton>
					{#if deleteConfirmation}
						<Popup on="click">
							<div class="content">{$T(deleteConfirmation)}</div>
							<Button color="red" icon="trash alternate outline" fluid on:click={()=> remove(true)}>{$T('cmd.delete')}</Button>
						</Popup>
					{/if}
				{/if}
				<slot name="row" editing={false} row={row} />
				<slot name="display-row" row={row} />
			{/if}
		</div>
	</Column>
{/if}