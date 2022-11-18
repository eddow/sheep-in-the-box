<script lang="ts">
	import {specialRow, getRowCtx, getTblCtx, setClmnCtx} from './utils'
	import {writable} from "svelte/store";
	import { element } from 'svelte/internal';
	import { T } from '$lib/globals';

	export let prop: string = '';
	export let title: string = '';
	export let headers: boolean = false;
	export let html: boolean = false;
	let thProps: any;
$:	thProps = headers ? {scope: 'row'} : {};
	let row: any = getRowCtx().row;
	const tblSetFilter = getTblCtx().setFilter;
	export let value: any = prop && (typeof row === 'object') && row[prop];
	const config = writable({});
$:	config.set({...$config, value});
$:	config.set({...$config, prop});
$:	config.set({...$config, title: title || (prop && $T('fld.'+prop))});
$:	config.set({...$config, headers});
$:	config.set({...$config, html});
	let ctx: any = {
		setFilter(filter: (name: any)=> boolean) {
			console.assert(!!prop, 'A filtered column must define a `prop`')
			tblSetFilter(prop, filter && ((row: any)=> filter(row[prop])));
		},
		config
	};
	setClmnCtx(ctx);
</script>
{#if !row}
	<div class="td">`Column` is to be used in a `Table` only</div>
{:else if row === specialRow.filter}
	<slot name="filter">
		<div class="td" />
	</slot>
{:else if row === specialRow.header}
	<slot name="header">
		<div class="th" scope="col">{title || prop}</div>
	</slot>
{:else if row === specialRow.footer}
	<slot name="footer">
		<div class="th" scope="col" />
	</slot>
{:else}
	<slot>
		<div class={headers?'th':'td'} {...thProps}>
			{#if html}
				{@html value}
			{:else}
				{value}
			{/if}
		</div>
	</slot>
{/if}
