<script lang="ts">
	import { Icon } from 'sveltestrap';
	import Input from '$lib/components/form/Input.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import type { EditingRowContext } from './utils';

	const { row, editing, dialog } = getRowCtx<EditingRowContext>();
	const { config } = getClmnCtx();
	let prop: string, title: string;
$:	prop = <string>$config.prop;
$:	title = <string>$config.title;
</script>
<Editor {...$$restProps}>
	<Icon slot="display" name={row[prop]?'check':'x'} />
	{#if $editing}
		<Input type="checkbox" bind:checked={$editing[prop]} name={prop} label={dialog?title:''} />
	{/if}
</Editor>