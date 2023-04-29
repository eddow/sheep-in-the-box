<script lang="ts">
	import Column from '../../Column.svelte'
	import { getRowCtx, getTblCtx } from '../../contexts';
	import { getEdtnCtx } from '../contexts';
	import { I } from '$sitb/intl';;
	import { Popup, Button, Loader } from 'svemantic';
	import type { AddableEditionContext, RowEditionContext } from './contexts';

	type Edition = 'dialog'|'row'|'both'|false;
	type T = $$Generic;

	const
		{ dialog, editing, deleteRow, startEdit } = getEdtnCtx<RowEditionContext<T>>(),
		{ deletable, add, editModal } = getTblCtx<AddableEditionContext<T>>(),
		ColumnT = Column<T>,
		model = getRowCtx<T|undefined>();
	export let edition: Edition = 'row',
		create: Edition = false,
		creation: ()=> T = ()=> (<T>{});
	
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
	<slot name="dialog" adding={false} model={$model} />
{:else if !dialog}
	<ColumnT let:model>
		<th scope="col" slot="header">
			{#if hasSpec(create, 'row')}<Button tiny on:click={()=> add(creation())} positive icon="add" />{/if}
			{#if hasSpec(create, 'dialog')}<Button tiny on:click={()=> editModal(creation())} icon={['external alternate', 'green corner add']} />{/if}
			<slot name="header" />
		</th>
		<th class="ui collapsing buttons" class:editing={!!$editing} scope="row">
			<Loader inverted loading={$editing == 'working'} />
			{#if $editing}
				<Button tiny submit primary icon="save" />
				<Button tiny cancel color="yellow" icon="times" />
				<slot name="row" editing={true} model={$editing} />
				<slot name="edit-row" model={$editing} />
			{:else}
				{#if hasSpec(edition, 'row')}<Button tiny on:click={startEdit} icon="edit outline" />{/if}
				{#if hasSpec(edition, 'dialog')}<Button tiny on:click={()=> editModal(model)} icon="external alternate" />{/if}
				{#if deletable}
					<Button tiny on:click={()=> remove()} negative icon="trash alternate outline" />
					{#if deleteConfirmation}
						<Popup on="click">
							<div class="header">{$I(deleteConfirmation)}</div>
							<Button negative icon="trash alternate outline" on:click={()=> remove(true)}>{$I('cmd.delete')}</Button>
						</Popup>
					{/if}
				{/if}
				<slot name="row" editing={false} {model} />
				<slot name="display-row" {model} />
			{/if}
		</th>
	</ColumnT>
{/if}
<style lang="scss">
	.prefix-icon i { margin-right: .5em; }
</style>