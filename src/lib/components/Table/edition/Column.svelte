<script lang="ts">
	import { FormGroup } from 'sveltestrap';
	import Column from '../Column.svelte'
	import { getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const {row, editing, dialog} = getRowCtx<EditingRowContext>();
	export let prop: string;
	export let title: string = '';
	export let headers: boolean = false;
	export let html: boolean = false;
	export let getDisplay = (x:string)=> x;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
</script>
{#if dialog === 'body'}
	<FormGroup floating label={title}>
		<slot />
	</FormGroup>
{:else if !dialog}
	<Column {title}>
		{#if $editing}
			<slot name="edit">
				<svelte:element this={headers?'th':'td'} {...thProps} class="selection">
					<slot />
				</svelte:element>
			</slot>
		{:else}
			<slot name="display">
				<svelte:element this={headers?'th':'td'} {...thProps}>
					{#if html}
						{@html getDisplay(row[prop])}
					{:else}
						{getDisplay(row[prop])}
					{/if}
				</svelte:element>
			</slot>
		{/if}
	</Column>
{/if}