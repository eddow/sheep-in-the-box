<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { config } = getClmnCtx();
	let prop: string;
	export let value: string;
	export let placeholder: string | undefined = undefined;
$:	prop = <string>$config.prop;
	export let area: boolean = false;
	export let autofocus: boolean = false;
</script>
<Editor {...$$restProps} {value}>
	<Input {placeholder} {autofocus} type={area ? 'textarea' : 'text'} bind:value name={prop} />
</Editor>