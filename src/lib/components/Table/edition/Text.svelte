<script lang="ts">
	import { Input } from 'sveltestrap';
	import Editor from './Editor.svelte'
	import {getClmnCtx, getRowCtx} from '../utils'
	import type { EditingRowContext } from './utils';

	const {editing} = getRowCtx<EditingRowContext>();
	const { config } = getClmnCtx();
	let prop: string;
$:	prop = <string>$config.prop;
	export let title: string = '';
	export let area: boolean = false;
	export let required: boolean = false;
	export let autofocus: boolean = false;
</script>
<Editor {...$$props}>
	{#if $editing}
		<Input {autofocus} {required} type={area ? 'textarea' : 'text'} bind:value={$editing[prop]} name={prop} placeholder={title} />
	{/if}
</Editor>