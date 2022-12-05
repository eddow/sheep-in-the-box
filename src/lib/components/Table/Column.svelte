<script lang="ts">
	import { specialRow, getTblCtx, setClmnCtx } from './utils'
	import { writable } from "svelte/store";
	import { T } from '$lib/globals';

	export let prop: string = '';
	export let title: string = '';
	export let headers: boolean = false;
	export let html: boolean = false;
	let thProps: any;
$:	thProps = headers ? {'data-scope': 'row'} : {};
	export let row: any;
	const tblSetFilter = getTblCtx().setFilter;
	export let value: any = null;
$:	value = (prop && row && (typeof row === 'object') && row[prop]) || '';
	const config = writable({});
$:	config.set({...$config, value});
$:	config.set({...$config, prop});
$:	config.set({...$config, title: title === undefined ? (prop && $T('fld.'+prop)) : title});
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
		<div class="th" data-scope="col">{title || prop}</div>
	</slot>
{:else if row === specialRow.footer}
	<slot name="footer">
		<div class="th" data-scope="col" />
	</slot>
{:else}
	<slot {row} {value}>
		<div class={headers?'th':'td'} {...thProps}>
			{#if html}
				{@html value}
			{:else}
				{value}
			{/if}
		</div>
	</slot>
{/if}
