<script lang="ts">
	import type { TextType } from "$sitb/constants";
	import { parmed } from "$sitb/intl";
	import { markdown } from "markdown";
	import po from "./previewObject";
	
	export let type: TextType;
	export let text: string;
	let paramed: string, displayed: string;
$:	paramed = parmed(text || '', po);
$:	displayed = type === 'md' ? markdown.toHTML(paramed) : paramed;
</script>
{#if !type || type === 'tpl'}
	<pre>{paramed}</pre>
{:else if type in {html: 1, md: 1}}
	{@html displayed}
{/if}