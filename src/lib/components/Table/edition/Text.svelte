<script lang="ts">
	import { FormGroup, Input } from 'sveltestrap';
	import Column from '../Column.svelte'
	import {getRowCtx} from '../utils'
	import type { EditingContext } from './TableRow.svelte';

	const {row, editing, dialog} = getRowCtx<EditingContext>();
	export let prop: string;
	export let title: string = '';
	export let headers: boolean = false;
	export let area: boolean = false;
	export let html: boolean = false;
	export let required: boolean = false;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
</script>
{#if dialog === 'body'}
	<FormGroup floating label={title}>
		<Input {required} type={area ? 'textarea' : 'text'} bind:value={row[prop]} name={prop} placeholder={title} />
	</FormGroup>
{:else if !dialog}
	<Column {title}>
		{#if $editing}
			<slot name="edit">
				<td class="selection">
					<Input {required} type={area ? 'textarea' : 'text'} bind:value={row[prop]} />
				</td>
			</slot>
		{:else}
			<slot>
				<svelte:element this={headers?'th':'td'} {...thProps}>
					{#if html}
						{@html row[prop]}
					{:else}
						{row[prop]}
					{/if}
				</svelte:element>
			</slot>
		{/if}
	</Column>
{/if}