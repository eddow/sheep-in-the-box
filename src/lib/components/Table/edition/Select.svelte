<script lang="ts">
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../utils'
	import { Select } from 'svemantic';

	const { config } = getClmnCtx();
	export let placeholder: string | undefined = undefined;
	let prop: string;
$:	prop = <string>$config.prop;
	export let options: any[];
	export let value: string;
	function getDisplay(value: string) {
		const itm = options.find(o=> o.value === value);
		return itm?.display || itm?.text || value;
	}
</script>
<Editor {...$$restProps} {getDisplay} {value}>
	<Select {options} {placeholder} name={prop} bind:value />
</Editor>