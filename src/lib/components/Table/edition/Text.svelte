<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../utils'

	const { config } = getClmnCtx();
	let prop: string;
$:	prop = <string>$config.prop;
	export let value: string;
	export let placeholder: string | undefined = undefined;
	export let area: boolean = false;
	export let autofocus: boolean = false;
</script>
<Editor {...$$restProps} {value}>
	<Input {placeholder} {autofocus} type={area ? 'textarea' : 'text'} bind:value name={prop} />
</Editor>