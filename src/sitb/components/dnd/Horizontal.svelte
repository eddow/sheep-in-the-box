 <script lang="ts">   
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let items: any[];
	export let itemWidth = '5em';
	export let flipDurationMs = 300;
	export let type: string = 'any';
	export let dropFromOthersDisabled: boolean = false;
	function handleDndConsider({detail}: CustomEvent) {
		items = detail.items;
	}
	function handleDndFinalize({detail}: CustomEvent) {
		items = detail.items;
		dispatch('reordered', detail);
	}
</script>
<section use:dndzone={{items, flipDurationMs, type, dropFromOthersDisabled}}
	on:consider={handleDndConsider} on:finalize={handleDndFinalize}
	{...$$restProps}
>
	{#each items as item(item.id)}
		<div style="flex: 0 0 {itemWidth}" animate:flip="{{duration: flipDurationMs}}">
			<slot {item}>
				{item.id}
			</slot>
		</div>
	{/each}
</section>
<style>
section {
	display: flex;
}
</style>