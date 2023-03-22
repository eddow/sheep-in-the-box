<script lang="ts">
	import type { TextType } from "$sitb/constants";
	import Preview from "../Preview.svelte";

	export let name: string;
	export let value = '';
	export let preview: TextType = '';
	// If codemirror needs to be instanciated, it's here ^^
</script>
{#if preview}
	<input type="hidden" {name} {value} />
	<Preview type={preview} text={value} />
{:else}
	<div {...$$restProps}>
		<textarea style="resize: none; width: 100%; height: 100%;" bind:value {name} />
	</div>
{/if}