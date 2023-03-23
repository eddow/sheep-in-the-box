<script lang="ts">
	import { Cell, Field } from 'svemantic';
	import { getClmnCtx, getRowCtx } from '../utils'
	import { Dialog, getEdtnCtx, type EditingRowContext, type EditionContext } from './utils';

	const { dialog } = getRowCtx<EditingRowContext>();
	const { editing } = getEdtnCtx();
	const { config } = getClmnCtx();
	let prop: string, title: string, header: boolean;
	let row: any = null;	// Should the editor has access to `row` ?
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
$:	header = <boolean>$config.header;
	export let
		html = (x:string, row: any)=> $config.html,
		getDisplay = (x: any, row: any)=> x,
		value: any;
</script>
{#if dialog === Dialog.Body}
	<Field><slot /></Field>
{:else if dialog === Dialog.Wrapped}
	{#if $editing}
		<slot />
	{:else}
		<slot name="display">
			{#if html(value, row)}
				{@html getDisplay(value, row)}
			{:else}
				{getDisplay(value, row)}
			{/if}
		</slot>
	{/if}
{:else if !dialog}
	{#if $editing}
		<slot />
	{:else}
		<Cell {header} scope="row">
			<slot name="display">
				{#if html(value, row)}
					{@html getDisplay(value, row)}
				{:else}
					{getDisplay(value, row)}
				{/if}
			</slot>
		</Cell>
	{/if}
{/if}