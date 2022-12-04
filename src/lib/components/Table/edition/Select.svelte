<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../utils'

	const { config } = getClmnCtx();
	export let placeholder: string | undefined = undefined;
	let prop: string, title: string;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
	export let autofocus: boolean = false;
	export let options: any[];
	function getDisplay(value: string) {
		return options.find(o=> o.value === value)?.text || value;
	}
</script>
<Editor {...$$restProps} {getDisplay}>
	<Input {placeholder} {autofocus} type="select" name={prop}>
		{#each options as option}
			{#if typeof option === 'string'}
				<option>{option}</option>
			{:else}
				<option value={option.value}>{option.text}</option>
			{/if}
		{/each}
	</Input>
</Editor>