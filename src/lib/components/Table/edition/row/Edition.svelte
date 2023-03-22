<script lang="ts">
	import Column from '../../Column.svelte'
	import { getRowCtx, getTblCtx } from '../../utils';
	import { Dialog, Editing, getEdtnCtx, type EditingRowContext, type EditingTableContext, type Edition, type RowEditionContext } from '../utils';
	import { I } from '$sitb/intl';;
	import { Popup, Button, toast, Loader } from 'svemantic';

	const { dialog, row: gvnRow } = getRowCtx<EditingRowContext>();
	const { editing, startEdit, cancelEdit, deleteRow, addRow, editModal } = getEdtnCtx<RowEditionContext>();
	const { deletable } = getTblCtx<EditingTableContext>();
	export let edition: Edition = 'row';
	export let create: Edition = false;
	export let creation: ()=> any = ()=> ({});
	export let row: any = gvnRow;
	
	function hasSpec(e: Edition, spec: Edition) {
		return <string>e in {[<string>spec]: 1, both: 1};
	}
	export let deleteConfirmation: string = '';
	async function remove(skipConf: boolean = false) {
		if(deleteConfirmation && !skipConf)
			return;
		await deleteRow();
	}
</script>
{#if dialog === Dialog.Footer}
	<Loader inverted loading={$editing == Editing.Working} />
	<Button class="prefix-icon" on:click={cancelEdit} icon="times">{$I('cmd.cancel')}</Button>
	<Button submit class="prefix-icon" primary icon="save">{$I('cmd.save')}</Button>
	<slot name="dialog" adding={false} row={row} />
{:else if !dialog}
	<Column>
		<th scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button tiny on:click={()=> addRow(creation())} color="green" icon="add" />{/if}
			{#if hasSpec(create, 'dialog')}<Button tiny on:click={()=> editModal(creation())} icon={['external alternate', 'green corner add']} />{/if}
			<slot name="header" />
		</th>
		<th class="collapsing" class:editing={!!$editing} scope="row">
			<Loader inverted loading={$editing == Editing.Working} />
			{#if $editing}
				<Button tiny submit primary icon="save" />
				<Button tiny on:click={cancelEdit} color="yellow" icon="times" />
				<slot name="row" editing={true} row={$editing} />
				<slot name="edit-row" row={$editing} />
			{:else}
				{#if hasSpec(edition, 'row')}<Button tiny on:click={startEdit} icon="edit outline" />{/if}
				{#if hasSpec(edition, 'dialog')}<Button tiny on:click={()=> editModal(row)} icon="external alternate" />{/if}
				{#if deletable}
					<Button tiny on:click={()=> remove()} color="red" icon="trash alternate outline" />
					{#if deleteConfirmation}
						<Popup on="click">
							<div class="header">{$I(deleteConfirmation)}</div>
							<Button color="red" icon="trash alternate outline" fluid on:click={()=> remove(true)}>{$I('cmd.delete')}</Button>
						</Popup>
					{/if}
				{/if}
				<slot name="row" editing={false} row={row} />
				<slot name="display-row" row={row} />
			{/if}
		</th>
	</Column>
{/if}