<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	export let items: any[];
	export let flipDurationMs = 300;
	// TODO Vertical DnD
	function handleDndConsider({detail}: CustomEvent) {
		items = detail.items;
	}
	function handleDndFinalize({detail}: CustomEvent) {
		items = detail.items;
	}
</script>
<section use:dndzone={{items, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
	{#each items as item(item.id)}
		<div animate:flip="{{duration: flipDurationMs}}">
			<slot {item}>
				{item.id}
			</slot>
		</div>
	{/each}
</section>

<style>
	section {
		width: 50%;
		padding: 0.3em;
		border: 1px solid black;
		overflow: scroll;
		height: 120px;
	}
	div {
		width: 50%;
		padding: 0.2em;
		border: 1px solid blue;
		margin: 0.15em 0;
	}
</style>