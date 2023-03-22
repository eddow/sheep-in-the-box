<script lang="ts">
	import { Input } from 'svemantic';
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
	<td><Input {placeholder} {autofocus} type={area ? 'area' : 'text'} bind:value name={prop} /></td>
</Editor>