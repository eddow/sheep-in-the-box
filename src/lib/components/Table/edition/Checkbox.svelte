<script lang="ts">
	import { Icon } from 'sveltestrap';
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { dialog } = getRowCtx<EditingRowContext>();
	const { config } = getClmnCtx();
	export let checked: boolean;
	let prop: string, title: string;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
</script>
<Editor value={checked} {...$$restProps}>
	<Icon slot="display" name={checked?'check':'x'} />
	<Input type="checkbox" bind:checked name={prop} label={dialog?title:''} />
</Editor>