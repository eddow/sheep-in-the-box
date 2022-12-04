<script lang="ts">
	import { FormGroup } from 'sveltestrap';
	import { getClmnCtx, getRowCtx } from '../utils'
	import { Dialog, getEdtnCtx, type EditingRowContext, type EditionContext } from './utils';

	const { row, dialog } = getRowCtx<EditingRowContext>();
	const { editing } = getEdtnCtx();
	const { config } = getClmnCtx();
	let prop: string, title: string, headers: boolean;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
$:	headers = <boolean>$config.headers;
	export let html = (x:string, row: any)=> $config.html;
	export let getDisplay = (x: string, row: any)=> x;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
</script>
{#if dialog === Dialog.Body}
	<FormGroup floating label={title}>
		<slot />
	</FormGroup>
{:else if !dialog}
	{#if $editing}
		<div class={headers?'th':'td'} {...thProps}>
			<slot />
		</div>
	{:else}
		<div class={headers?'th':'td'} {...thProps}>
			<slot name="display">
				{#if html(row[prop], row)}
					{@html getDisplay(row[prop], row)}
				{:else}
					{getDisplay(row[prop], row)}
				{/if}
			</slot>
		</div>
	{/if}
{/if}