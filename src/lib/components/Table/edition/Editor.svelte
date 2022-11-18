<script lang="ts">
	import { getFrmCtx } from '$lib/components/form/utils';
	import { FormGroup } from 'sveltestrap';
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { row, editing, dialog } = getRowCtx<EditingRowContext>();
	const { config } = getClmnCtx();
	let prop: string, title: string, headers: boolean, html: boolean;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
$:	headers = <boolean>$config.headers;
$:	html = <boolean>$config.html;
	export let getDisplay = (x:string)=> x;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
	const form = getFrmCtx().form;
</script>
{#if dialog === 'body'}
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
				{#if html}
					{@html getDisplay(row[prop])}
				{:else}
					{getDisplay(row[prop])}
				{/if}
			</slot>
		</div>
	{/if}
{/if}