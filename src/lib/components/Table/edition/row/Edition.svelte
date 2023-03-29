<script lang="ts">
	import Column from '../../Column.svelte'
	import { getRowCtx, getTblCtx } from '../../contexts';
	import { type Dialog, type Editing, getEdtnCtx, type RowContext } from '../contexts';
	import { I } from '$sitb/intl';;
	import { Popup, Button, toast, Loader } from 'svemantic';
	import type { AddableEditionContext, RowEditionContext } from './contexts';

	type Edition = 'dialog'|'row'|'both'|false;
	type T = $$Generic;

	const { model: gvnRow } = getRowCtx<RowContext<T>>();
	const { dialog, editing, deleteRow, startEdit } = getEdtnCtx<RowEditionContext<T>>();
	const { deletable, add, editModal } = getTblCtx<AddableEditionContext<T>>();
	export let edition: Edition = 'row',
		create: Edition = false,
		creation: ()=> T = ()=> (<T>{});
	let row: T;
	$: row = $gvnRow;
	
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
{#if dialog === 'actions'}
	<Loader inverted loading={$editing === 'working'} />
	<Button cancel class="prefix-icon" icon="times">{$I('cmd.cancel')}</Button>
	<Button submit class="prefix-icon" primary icon="save">{$I('cmd.save')}</Button>
	<slot name="dialog" adding={false} {row} />
{:else if !dialog}
	<Column>
		<th scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button tiny on:click={()=> add(creation())} color="green" icon="add" />{/if}
			{#if hasSpec(create, 'dialog')}<Button tiny on:click={()=> editModal(creation())} icon={['external alternate', 'green corner add']} />{/if}
			<slot name="header" />
		</th>
		<th class="ui collapsing buttons" class:editing={!!$editing} scope="row">
			<Loader inverted loading={$editing == 'working'} />
			{#if $editing}
				<Button tiny submit primary icon="save" />
				<Button tiny cancel color="yellow" icon="times" />
				<slot name="row" editing={true} row={$editing} />
				<slot name="edit-row" model={$editing} />
			{:else}
				{#if hasSpec(edition, 'row')}<Button tiny on:click={startEdit} icon="edit outline" />{/if}
				{#if hasSpec(edition, 'dialog')}<Button tiny on:click={()=> editModal(row)} icon="external alternate" />{/if}
				{#if deletable}
					<Button tiny on:click={()=> remove()} negative icon="trash alternate outline" />
					{#if deleteConfirmation}
						<Popup on="click">
							<div class="header">{$I(deleteConfirmation)}</div>
							<Button negative icon="trash alternate outline" on:click={()=> remove(true)}>{$I('cmd.delete')}</Button>
						</Popup>
					{/if}
				{/if}
				<slot name="row" editing={false} {row} />
				<slot name="display-row" {row} />
			{/if}
		</th>
	</Column>
{/if}