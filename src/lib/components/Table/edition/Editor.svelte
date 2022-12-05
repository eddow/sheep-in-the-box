<script lang="ts">
	import { FormGroup } from 'sveltestrap';
	import { getClmnCtx, getRowCtx } from '../utils'
	import { Dialog, getEdtnCtx, type EditingRowContext, type EditionContext } from './utils';

	const { dialog } = getRowCtx<EditingRowContext>();
	const { editing } = getEdtnCtx();
	const { config } = getClmnCtx();
	let prop: string, title: string, headers: boolean;
	let row: any = null;	// Should the editor has access to `row` ?
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
$:	headers = <boolean>$config.headers;
	export let html = (x:string, row: any)=> $config.html;
	export let getDisplay = (x: string, row: any)=> x;
	export let value: any;
	let thProps: any;
$:	thProps = headers ? {'data-scope': 'row'} : {};
</script>
{#if dialog === Dialog.Body}
	<FormGroup floating label={title}>
		<slot />
	</FormGroup>
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
		<div class={headers?'th':'td'} {...thProps}>
			<slot />
		</div>
	{:else}
		<div class={headers?'th':'td'} {...thProps}>
			<slot name="display">
				{#if html(value, row)}
					{@html getDisplay(value, row)}
				{:else}
					{getDisplay(value, row)}
				{/if}
			</slot>
		</div>
	{/if}
{/if}